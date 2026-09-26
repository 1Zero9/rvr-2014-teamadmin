import Link from 'next/link';
import { CalendarDays, Trophy } from 'lucide-react';
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

  return <PortalPage member={member} active="/portal" eyebrow="FINN&apos;S TEAM" title="Match day">
    <div className="metric-row">
      <div className="metric"><span>League position</span><strong>{rvr?.pos ?? '—'}</strong></div>
      <div className="metric"><span>Matches played</span><strong>{rvr?.p ?? '—'}</strong></div>
      <div className="metric metric-form"><span>Recent form</span><strong className="form-dots" aria-label={form.length ? `Recent form: ${form.join(', ')}` : 'No form yet'}>{form.length ? form.map((result, index) => <i className={`form-dot form-dot-${result.toLowerCase()}`} key={`${result}-${index}`}>{result}</i>) : '—'}</strong></div>
    </div>
    <div className="match-stats-layout">
      <article className="panel"><div className="section-heading"><div><span>UP NEXT</span><h3>{next ? `vs ${next.opponent}` : 'No fixture listed'}</h3></div><CalendarDays size={20} /></div>{next && <p className="match-stats-help">{next.matchDate} · {next.kickoffTime} · {next.venue}</p>}<Link href="/fixtures?view=scout" className="primary">Scout</Link></article>
      <article className="panel"><div className="section-heading"><div><span>LATEST RESULT</span><h3>{latest ? `${latest.rvrGoals}–${latest.opponentGoals} vs ${latest.opponent}` : 'No result listed'}</h3></div><Trophy size={20} /></div>{latest && <p className="match-stats-help">{latest.matchDate}</p>}<Link href="/stats" className="primary">Stats</Link></article>
    </div>
  </PortalPage>;
}
