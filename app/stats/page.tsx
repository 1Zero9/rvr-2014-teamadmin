import { desc } from 'drizzle-orm';
import { Award, Goal, Trophy } from 'lucide-react';
import { getDb } from '../../db';
import { matchPerformanceSummaries, playerMatchStats } from '../../db/schema';
import { MatchStatsManager } from '../components/match-stats-manager';
import { PortalPage } from '../components/portal-page';
import { requireApprovedMember } from '../lib/authz';
import { fetchLiveDdslLeagueData } from '../lib/ddsl-live';

export const dynamic = 'force-dynamic';

type Contribution = { playerName: string; goals: number; assists: number };

export default async function StatsPage() {
  const member = await requireApprovedMember();
  const live = await fetchLiveDdslLeagueData('218148');
  let summaries: typeof matchPerformanceSummaries.$inferSelect[] = [];
  let contributions: typeof playerMatchStats.$inferSelect[] = [];
  try {
    const db = getDb();
    [summaries, contributions] = await Promise.all([
      db.select().from(matchPerformanceSummaries).orderBy(desc(matchPerformanceSummaries.updatedAt)),
      db.select().from(playerMatchStats),
    ]);
  } catch (error) {
    console.error('Unable to load private match statistics:', error);
  }

  const matchLabels = new Map(live.rvrMatches.map((match) => [
    match.id,
    `${match.matchDate} · ${match.homeAway === 'home' ? 'RVR v' : 'RVR away to'} ${match.opponent}`,
  ]));
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
    if (summary.playerOfMatch) motm.set(summary.playerOfMatch, (motm.get(summary.playerOfMatch) || 0) + 1);
  }
  const motmLeaders = [...motm.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const realGoals = summaries.reduce((sum, item) => sum + item.rvrGoals, 0);

  return (
    <PortalPage member={member} active="/stats" eyebrow="PRIVATE PERFORMANCE TRACKER" title="Goals, assists & player of the match">
      <div className="notice private-stats-notice">
        <Trophy size={18} />
        <span><strong>Your real squad record.</strong> DDSL results remain official for the table; this tracker preserves the actual score and player contributions.</span>
      </div>
      <div className="metric-row">
        <div className="metric"><span>Matches recorded</span><strong>{summaries.length}</strong></div>
        <div className="metric"><span>Real RVR goals</span><strong>{realGoals}</strong></div>
        <div className="metric"><span>Contributions logged</span><strong>{contributions.reduce((sum, row) => sum + row.goals + row.assists, 0)}</strong></div>
      </div>
      <div className="match-stats-layout">
        <MatchStatsManager matches={live.rvrMatches.map((match) => ({ id: match.id, label: matchLabels.get(match.id) || match.id }))} />
        <article className="panel">
          <div className="section-heading"><div><span>SEASON TOTALS</span><h3>Goals & assists</h3></div><Goal size={20} /></div>
          {leaderboard.length === 0 ? <p className="match-stats-help">Record the first match to start the running table.</p> : (
            <table className="data-table compact-table"><thead><tr><th>Player</th><th>Goals</th><th>Assists</th></tr></thead><tbody>
              {leaderboard.map((row) => <tr key={row.playerName}><td><strong>{row.playerName}</strong></td><td>{row.goals}</td><td>{row.assists}</td></tr>)}
            </tbody></table>
          )}
        </article>
      </div>
      <article className="panel">
        <div className="section-heading"><div><span>PLAYER OF THE MATCH</span><h3>Matchday awards</h3></div><Award size={20} /></div>
        {motmLeaders.length === 0 ? <p className="match-stats-help">Player of the match awards will appear after your first record.</p> : (
          <div className="motm-list">{motmLeaders.map(([player, awards]) => <div key={player}><strong>{player}</strong><span>{awards} {awards === 1 ? 'award' : 'awards'}</span></div>)}</div>
        )}
      </article>
    </PortalPage>
  );
}
