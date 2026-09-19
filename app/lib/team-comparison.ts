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
