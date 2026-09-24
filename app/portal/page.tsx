import Link from 'next/link';
import { BarChart3, CalendarDays, Camera, ShieldCheck, Swords, Trophy } from 'lucide-react';
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

  return <PortalPage member={member} active="/portal" eyebrow="FINN&apos;S FOOTBALL" title="Match desk">
    <div className="notice private-stats-notice"><ShieldCheck size={18} /><span><strong>Private football desk.</strong> League information is from DDSL; your match notes and player records stay here.</span></div>
    <div className="metric-row">
      <div className="metric"><span>League position</span><strong>{rvr?.pos ?? '—'}</strong></div>
      <div className="metric"><span>Matches played</span><strong>{rvr?.p ?? '—'}</strong></div>
      <div className="metric metric-form"><span>Recent form</span><strong className="form-dots" aria-label={form.length ? `Recent form: ${form.join(', ')}` : 'No form yet'}>{form.length ? form.map((result, index) => <i className={`form-dot form-dot-${result.toLowerCase()}`} key={`${result}-${index}`}>{result}</i>) : '—'}</strong></div>
    </div>
    <div className="match-stats-layout">
      <article className="panel"><div className="section-heading"><div><span>UP NEXT</span><h3>{next ? `vs ${next.opponent}` : 'No fixture listed'}</h3></div><CalendarDays size={20} /></div>{next && <p className="match-stats-help">{next.matchDate} · {next.kickoffTime} · {next.venue}</p>}<Link href="/fixtures?view=scout" className="primary">Scout next opponent</Link></article>
      <article className="panel"><div className="section-heading"><div><span>LATEST RESULT</span><h3>{latest ? `${latest.rvrGoals}–${latest.opponentGoals} vs ${latest.opponent}` : 'No result listed'}</h3></div><Trophy size={20} /></div>{latest && <p className="match-stats-help">{latest.matchDate} · Official DDSL record</p>}<Link href="/stats" className="primary">Open private match stats</Link></article>
    </div>
    <div className="match-stats-layout">
      <Link href="/fixtures" className="panel portal-hub-card"><div><CalendarDays size={22} /><h3>Matches</h3><p>Fixtures, league table, results and opponent scouting in one place.</p></div></Link>
      <Link href="/stats" className="panel portal-hub-card"><div><BarChart3 size={22} /><h3>Match Import & Stats</h3><p>Import screenshots and maintain actual scores, goals, assists and selections.</p></div></Link>
      <Link href="/albums" className="panel portal-hub-card"><div><Camera size={22} /><h3>Albums</h3><p>Keep simple links to private Google Photos match albums.</p></div></Link>
    </div>
  </PortalPage>;
}
