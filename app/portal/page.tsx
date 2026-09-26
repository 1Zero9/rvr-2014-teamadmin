import Link from 'next/link';
import { PortalPage } from '../components/portal-page';
import { requireApprovedMember } from '../lib/authz';
import { fetchLiveDdslLeagueData } from '../lib/ddsl-live';

export const dynamic = 'force-dynamic';

export default async function PortalDashboardPage() {
  const member = await requireApprovedMember();
  const live = await fetchLiveDdslLeagueData('218148');
  const next = live.rvrMatches.find((match) => match.status === 'upcoming');
  const latest = [...live.rvrMatches].reverse().find((match) => match.status === 'completed');
  const rvr = live.standings.find((team) => team.isRvr);
  const form = rvr?.form.slice(-5) ?? [];

  const rvrIndex = live.standings.findIndex((team) => team.isRvr);
  const windowStart = rvrIndex >= 0 ? Math.max(0, Math.min(rvrIndex - 2, live.standings.length - 5)) : 0;
  const standingsSnapshot = live.standings.slice(windowStart, windowStart + 5);

  return <PortalPage member={member} active="/portal" eyebrow="FINN&apos;S TEAM" title="Match day">
    <div className="scoreboard-readout">
      <div><span>Position</span><strong>{rvr?.pos ?? '—'}</strong></div>
      <div><span>Played</span><strong>{rvr?.p ?? '—'}</strong></div>
      <div>
        <span>Form</span>
        <div className="scoreboard-form" aria-label={form.length ? `Recent form: ${form.join(', ')}` : 'No form yet'}>
          {form.length ? form.map((result, index) => <i className={`sb-${result.toLowerCase()}`} key={`${result}-${index}`}>{result}</i>) : <i>—</i>}
        </div>
      </div>
    </div>

    <div className="scoreboard-stack">
      <Link href="/fixtures?view=scout" className="scoreboard-block next">
        <span className="label">{next ? `Up next · ${next.matchDate}` : 'Up next'}</span>
        <h3>{next ? next.opponent : 'No fixture listed'}</h3>
        {next && <p className="meta">{next.kickoffTime} · {next.venue} · {next.homeAway === 'home' ? 'Home' : next.homeAway === 'away' ? 'Away' : 'Neutral'}</p>}
      </Link>

      <Link href="/stats" className="scoreboard-block">
        <span className="label">{latest ? `Full time · ${latest.matchDate}` : 'Latest result'}</span>
        {latest ? <div className="score">{latest.rvrGoals ?? 0}&ndash;{latest.opponentGoals ?? 0}</div> : <h3>No result listed</h3>}
        {latest && (() => {
          const rvrGoals = latest.rvrGoals ?? 0;
          const opponentGoals = latest.opponentGoals ?? 0;
          const outcome = rvrGoals > opponentGoals ? `${latest.homeAway === 'home' ? 'Home' : 'Away'} win` : rvrGoals < opponentGoals ? 'Loss' : 'Draw';
          return <p className="meta">vs {latest.opponent} · {outcome}</p>;
        })()}
      </Link>

      {standingsSnapshot.length > 0 && (
        <div className="scoreboard-standings">
          <span className="label">League snapshot</span>
          {standingsSnapshot.map((team) => (
            <div className={team.isRvr ? 'scoreboard-standings-row is-rvr' : 'scoreboard-standings-row'} key={team.team}>
              <span className="pos">{team.pos}</span>
              <span className="team">{team.team}</span>
              <span className="pts">{team.pts} pts</span>
            </div>
          ))}
        </div>
      )}
    </div>
  </PortalPage>;
}
