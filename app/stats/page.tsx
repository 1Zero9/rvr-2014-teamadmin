import { desc } from 'drizzle-orm';
import { Goal } from 'lucide-react';
import { getDb } from '../../db';
import { matchCards, matchGoalEvents, matchPerformanceSummaries, matchPotmAwards, playerMatchStats } from '../../db/schema';
import { GoalsAssistsLeaderboard } from '../components/goals-assists-leaderboard';
import { MatchDetailCard } from '../components/match-detail-card';
import { MatchScreenshotImporter } from '../components/match-screenshot-importer';
import { PortalPage } from '../components/portal-page';
import { requireApprovedMember } from '../lib/authz';
import { fetchLiveDdslLeagueData } from '../lib/ddsl-live';
import { getMatchesFromDb } from '../lib/matches';
import { COMPETITION_TYPES, parseDdslDate, splitPlayerNames, type CompetitionType } from '../lib/match-import';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

type Contribution = { playerName: string; goals: number; assists: number };

export default async function StatsPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  const filter = COMPETITION_TYPES.find((entry) => entry.value === type)?.value;
  const member = await requireApprovedMember();
  const [live, cachedMatches] = await Promise.all([fetchLiveDdslLeagueData('218148'), getMatchesFromDb()]);
  let summaries: typeof matchPerformanceSummaries.$inferSelect[] = [];
  let contributions: typeof playerMatchStats.$inferSelect[] = [];
  let goalEvents: typeof matchGoalEvents.$inferSelect[] = [];
  let potmRows: typeof matchPotmAwards.$inferSelect[] = [];
  let cardRows: typeof matchCards.$inferSelect[] = [];
  try {
    const db = getDb();
    [summaries, contributions, goalEvents, potmRows, cardRows] = await Promise.all([
      db.select().from(matchPerformanceSummaries).orderBy(desc(matchPerformanceSummaries.updatedAt)),
      db.select().from(playerMatchStats),
      db.select().from(matchGoalEvents).orderBy(matchGoalEvents.sortOrder),
      db.select().from(matchPotmAwards),
      db.select().from(matchCards).orderBy(matchCards.sortOrder),
    ]);
  } catch (error) {
    console.error('Unable to load private match statistics:', error);
  }
  const goalsByMatch = new Map<string, typeof matchGoalEvents.$inferSelect[]>();
  for (const goal of goalEvents) {
    const list = goalsByMatch.get(goal.matchId) || [];
    list.push(goal);
    goalsByMatch.set(goal.matchId, list);
  }

  // The live DDSL scrape only lists a rolling window of fixtures, so a
  // completed match can drop off it over time. Fall back to the app's own
  // persisted match cache (kept in sync by /api/ddsl/sync) for anything the
  // live fetch no longer has, so older matches still show their real name.
  const allKnownMatches = [...cachedMatches, ...live.rvrMatches];
  const matchLabels = new Map(allKnownMatches.map((match) => [
    match.id,
    `${match.matchDate} · ${match.homeAway === 'home' ? 'RVR v' : 'RVR away to'} ${match.opponent}`,
  ]));
  const opponentNames = new Map(allKnownMatches.map((match) => [match.id, match.opponent]));
  const matchDates = new Map(allKnownMatches.map((match) => [match.id, match.matchDate]));
  // Newest match first, by real match date.
  const allSummaries = [...summaries].sort((a, b) => parseDdslDate(matchDates.get(b.matchId) || '') - parseDdslDate(matchDates.get(a.matchId) || ''));
  summaries = filter ? allSummaries.filter((summary) => summary.competitionType === filter) : allSummaries;
  const inScope = new Set(summaries.map((summary) => summary.matchId));
  contributions = contributions.filter((row) => inScope.has(row.matchId));
  const potmByMatch = new Map<string, string[]>();
  for (const row of potmRows) potmByMatch.set(row.matchId, [...(potmByMatch.get(row.matchId) || []), row.playerName]);
  // Records saved before multiple awards existed only have the joined text.
  for (const summary of summaries) if (!potmByMatch.has(summary.matchId)) potmByMatch.set(summary.matchId, splitPlayerNames(summary.playerOfMatch));
  const cardsByMatch = new Map<string, typeof matchCards.$inferSelect[]>();
  for (const row of cardRows) cardsByMatch.set(row.matchId, [...(cardsByMatch.get(row.matchId) || []), row]);
  const cardTotals = new Map<string, { playerName: string; yellow: number; red: number }>();
  for (const row of cardRows) {
    if (!inScope.has(row.matchId)) continue;
    const current = cardTotals.get(row.playerName) || { playerName: row.playerName, yellow: 0, red: 0 };
    current[row.card]++;
    cardTotals.set(row.playerName, current);
  }
  const cardLeaders = [...cardTotals.values()].sort((a, b) => b.red - a.red || b.yellow - a.yellow || a.playerName.localeCompare(b.playerName));
  const totals = new Map<string, Contribution>();
  for (const row of contributions) {
    const current = totals.get(row.playerName) || { playerName: row.playerName, goals: 0, assists: 0 };
    current.goals += row.goals;
    current.assists += row.assists;
    totals.set(row.playerName, current);
  }
  const leaderboard = [...totals.values()].sort((a, b) => b.goals - a.goals || b.assists - a.assists || a.playerName.localeCompare(b.playerName));
  const motm = new Map<string, number>();
  for (const summary of summaries) {
    for (const name of potmByMatch.get(summary.matchId) || []) motm.set(name, (motm.get(name) || 0) + 1);
  }
  const motmLeaders = [...motm.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const realGoals = summaries.reduce((sum, item) => sum + item.rvrGoals, 0);

  return (
    <PortalPage member={member} active="/stats" eyebrow="STATS" title="Season record">
      <div className="metric-row">
        <div className="metric"><span>Matches recorded</span><strong>{summaries.length}</strong></div>
        <div className="metric"><span>Real RVR goals</span><strong>{realGoals}</strong></div>
        <div className="metric"><span>Contributions logged</span><strong>{contributions.reduce((sum, row) => sum + row.goals + row.assists, 0)}</strong></div>
      </div>
      <div className="type-filter" aria-label="Competition filter">
        {[{ value: undefined, label: 'All' }, ...COMPETITION_TYPES].map((entry) => (
          <Link key={entry.label} href={entry.value ? `/stats?type=${entry.value}` : '/stats'} className={filter === entry.value ? 'active' : ''}>{entry.label}</Link>
        ))}
      </div>
      <MatchScreenshotImporter matches={live.rvrMatches
        .filter((match) => match.status === 'completed')
        .sort((a, b) => parseDdslDate(b.matchDate) - parseDdslDate(a.matchDate))
        .map((match) => ({ id: match.id, label: matchLabels.get(match.id) || match.id, competition: match.competition, recorded: allSummaries.some((summary) => summary.matchId === match.id) }))} />
      <GoalsAssistsLeaderboard
        leaderboard={leaderboard}
        motmLeaders={motmLeaders.map(([playerName, awards]) => ({ playerName, awards }))}
        cardLeaders={cardLeaders}
      />
      <article className="panel">
        <div className="section-heading"><div><span>MATCH BY MATCH</span><h3>Per-match record</h3></div><Goal size={20} /></div>
        {summaries.length === 0 ? <p className="match-stats-help">Record your first match above to see it here.</p> : (
          summaries.map((summary) => (
            <MatchDetailCard
              key={`${summary.matchId}-${summary.updatedAt}`}
              matchId={summary.matchId}
              label={matchLabels.get(summary.matchId) || 'Recorded match'}
              date={matchDates.get(summary.matchId) || ''}
              opponentName={opponentNames.get(summary.matchId) || 'the opposition'}
              rvrGoals={summary.rvrGoals}
              opponentGoals={summary.opponentGoals}
              playersOfMatch={potmByMatch.get(summary.matchId) || []}
              competitionType={summary.competitionType as CompetitionType}
              cards={(cardsByMatch.get(summary.matchId) || []).map((card) => ({ playerName: card.playerName, card: card.card, minute: card.minute }))}
              notes={summary.notes}
              goals={(goalsByMatch.get(summary.matchId) || []).map((goal) => ({ minute: goal.minute, scorerName: goal.scorerName, assistName: goal.assistName, team: goal.team }))}
            />
          ))
        )}
      </article>
    </PortalPage>
  );
}
