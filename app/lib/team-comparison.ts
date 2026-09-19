import { MatchRecord } from './matches-data';

export const RVR_TEAM_NAME = 'River Valley Rangers FC';

export interface TeamResult {
  opponent: string;
  scoreFor: number;
  scoreAgainst: number;
  result: 'W' | 'D' | 'L';
  date: string;
  venue: 'home' | 'away';
}

const MONTHS: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

/** Parses DDSL's "19 Sep 2026" date strings into a sortable timestamp.
 * Anything that doesn't match (e.g. "TBC") sorts first (oldest). */
function parseMatchDate(date: string): number {
  const m = date.match(/(\d{1,2})\s+([A-Za-z]{3})\w*\s+(\d{4})/);
  if (!m) return 0;
  const month = MONTHS[m[2].toLowerCase().slice(0, 3)];
  if (month === undefined) return 0;
  return new Date(Number(m[3]), month, Number(m[1])).getTime();
}

/** Every completed result for `team`, from that team's own perspective,
 * oldest first. Uses each match's homeTeam/awayTeam/homeScore/awayScore
 * directly - the same fields the corrected standings computation relies on
 * - rather than the RVR-relative rvrGoals/opponentGoals fields, so this
 * works identically for RVR and for any other division team. */
export function resultsForTeam(matches: MatchRecord[], team: string): TeamResult[] {
  return matches
    .filter(
      (m) =>
        m.status === 'completed' &&
        m.homeScore != null &&
        m.awayScore != null &&
        (m.homeTeam === team || m.awayTeam === team),
    )
    .map((m) => {
      const isHome = m.homeTeam === team;
      const scoreFor = (isHome ? m.homeScore : m.awayScore)!;
      const scoreAgainst = (isHome ? m.awayScore : m.homeScore)!;
      const opponent = (isHome ? m.awayTeam : m.homeTeam)!;
      const result: TeamResult['result'] =
        scoreFor > scoreAgainst ? 'W' : scoreFor === scoreAgainst ? 'D' : 'L';
      const venue: TeamResult['venue'] = isHome ? 'home' : 'away';
      return {
        opponent,
        scoreFor,
        scoreAgainst,
        result,
        date: m.matchDate,
        venue,
      };
    })
    .sort((a, b) => parseMatchDate(a.date) - parseMatchDate(b.date));
}

/** Last `n` results for `team`, most recent first - the form guide. */
export function getRecentForm(matches: MatchRecord[], team: string, n = 5): TeamResult[] {
  return resultsForTeam(matches, team).slice(-n).reverse();
}

export interface CommonOpponentRow {
  opponent: string;
  teamAResult: TeamResult;
  teamBResult: TeamResult;
}

/** Opponents both teamA and teamB have already played, each side's result
 * against them. This is the actual answer to "how do we look against a team
 * we haven't played yet" - not a guess, just what's already on the record
 * against shared opposition. Sorted by how recently teamB (typically the
 * not-yet-played upcoming opponent) played that common opponent, most
 * recent first, since a fresher data point matters more than an old one. */
export function getCommonOpponentComparison(
  matches: MatchRecord[],
  teamA: string,
  teamB: string,
): CommonOpponentRow[] {
  const aResults = resultsForTeam(matches, teamA);
  const bResults = resultsForTeam(matches, teamB);
  const aByOpponent = new Map(aResults.map((r) => [r.opponent, r]));
  const bByOpponent = new Map(bResults.map((r) => [r.opponent, r]));

  const common = [...aByOpponent.keys()].filter(
    (o) => o !== teamA && o !== teamB && bByOpponent.has(o),
  );

  return common
    .map((opponent) => ({
      opponent,
      teamAResult: aByOpponent.get(opponent)!,
      teamBResult: bByOpponent.get(opponent)!,
    }))
    .sort((a, b) => parseMatchDate(b.teamBResult.date) - parseMatchDate(a.teamBResult.date));
}

const RESULT_POINTS: Record<TeamResult['result'], number> = { W: 3, D: 1, L: 0 };

function formPoints(results: TeamResult[]): number {
  return results.reduce((sum, r) => sum + RESULT_POINTS[r.result], 0);
}

export interface MatchupVerdict {
  favoured: 'teamA' | 'teamB' | 'even';
  /** -1 (strongly favours teamB) to +1 (strongly favours teamA). A
   * transparent score, not a probability - shown so the reasoning is
   * checkable, not asserted. */
  score: number;
  reasons: string[];
}

/** A real verdict, not a guess dressed up as one: combines each team's last-5
 * form (how they're playing right now) with their record against common
 * opponents (how they'd likely do against similar opposition), when common
 * opponents exist. This is a simple, fully explainable heuristic - not a
 * statistical model - and says so via `reasons` rather than presenting a
 * bare score or a fabricated predicted scoreline. */
export function getMatchupVerdict(
  matches: MatchRecord[],
  teamA: string,
  teamB: string,
): MatchupVerdict {
  const reasons: string[] = [];

  const aForm = getRecentForm(matches, teamA);
  const bForm = getRecentForm(matches, teamB);
  const aFormPts = formPoints(aForm);
  const bFormPts = formPoints(bForm);
  const maxFormPts = Math.max(aForm.length, bForm.length, 1) * 3;
  // -1..+1, teamA's share of the two teams' combined form points
  const formScore = maxFormPts > 0 ? (aFormPts - bFormPts) / maxFormPts : 0;

  if (aForm.length > 0 || bForm.length > 0) {
    reasons.push(
      `Recent form: ${teamA} ${aForm.map((r) => r.result).join('') || '—'} ` +
        `(${aFormPts} pts) vs ${teamB} ${bForm.map((r) => r.result).join('') || '—'} (${bFormPts} pts)`,
    );
  }

  const common = getCommonOpponentComparison(matches, teamA, teamB);
  let commonScore = 0;
  if (common.length > 0) {
    const aPtsTotal = common.reduce((s, row) => s + RESULT_POINTS[row.teamAResult.result], 0);
    const bPtsTotal = common.reduce((s, row) => s + RESULT_POINTS[row.teamBResult.result], 0);
    const perOpponent = common.map((row) => {
      const aPts = RESULT_POINTS[row.teamAResult.result];
      const bPts = RESULT_POINTS[row.teamBResult.result];
      const aGd = row.teamAResult.scoreFor - row.teamAResult.scoreAgainst;
      const bGd = row.teamBResult.scoreFor - row.teamBResult.scoreAgainst;
      // Points difference dominates (max +/-3), goal difference is a minor
      // tiebreaker - matches how the league table itself is ordered.
      return (aPts - bPts) / 3 + (aGd - bGd) * 0.05;
    });
    commonScore = Math.max(-1, Math.min(1, perOpponent.reduce((s, v) => s + v, 0) / perOpponent.length));
    // Actual point totals, not a confident-sounding label - a single shared
    // opponent is a thin sample and the reasoning should read that way,
    // not assert "the stronger record" from one result.
    reasons.push(
      `Against ${common.length} shared opponent${common.length > 1 ? 's' : ''}: ` +
        `${teamA} ${aPtsTotal} pts, ${teamB} ${bPtsTotal} pts` +
        (common.length === 1 ? ' (one match - a thin sample)' : ''),
    );
  } else {
    reasons.push('No shared opponents played yet - based on recent form only');
  }

  // Weight common-opponent evidence higher when it exists - it's a more
  // specific signal (same opposition) than generic recent form against
  // whoever else happened to be on the fixture list.
  const score = common.length > 0 ? formScore * 0.4 + commonScore * 0.6 : formScore;

  const favoured: MatchupVerdict['favoured'] =
    score > 0.15 ? 'teamA' : score < -0.15 ? 'teamB' : 'even';

  return { favoured, score, reasons };
}
