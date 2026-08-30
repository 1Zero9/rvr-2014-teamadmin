import Image from 'next/image';
import { desc } from 'drizzle-orm';
import { ArrowDownLeft, ArrowUpRight, CalendarDays, ChevronRight, CircleHelp, ClipboardList, Home, Landmark, Lightbulb, MapPin, Plus, ReceiptText, Settings, ShieldCheck, WalletCards } from 'lucide-react';
import { getDb } from '../db';
import { transactions } from '../db/schema';
import { AccessPending } from './components/portal-page';
import { getCurrentMember } from './lib/authz';

export const dynamic = 'force-dynamic';

const nav = [
  ['Overview', Home], ['Team fund', WalletCards], ['Contributions', ArrowDownLeft],
  ['Expenses', ReceiptText], ['Calendar', CalendarDays], ['Activity ideas', Lightbulb],
  ['Team information', CircleHelp],
] as const;
export default async function HomePage() {
  const member = await getCurrentMember();
  if (!member.approved) return <AccessPending member={member} />;
  const rows = await getDb().select().from(transactions).orderBy(desc(transactions.occurredOn));
  const income = rows.filter((r) => r.type === 'income' && r.status !== 'rejected').reduce((sum, r) => sum + r.amountCents, 0);
  const expense = rows.filter((r) => r.type === 'expense' && (r.status === 'approved' || r.status === 'paid')).reduce((sum, r) => sum + r.amountCents, 0);
  const balance = income - expense;
  const displayName = member.displayName.split(' ')[0];
  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><Image src="/rvr-white.png" width={52} height={52} alt="Rivervalley Rangers AFC crest" priority /><div><strong>RVR 2014</strong><span>Team Admin</span></div></div>
        <nav aria-label="Main navigation">
          {nav.map(([label, Icon], index) => { const href = ['/', '/fund', '/contributions', '/expenses', '/calendar', '/ideas', '/information'][index]; return <a className={index === 0 ? 'nav-link active' : 'nav-link'} href={href} key={label}><Icon size={18} strokeWidth={1.8} /><span>{label}</span>{label === 'Expenses' && rows.some((r) => r.type === 'expense' && r.status === 'pending') && <em>{rows.filter((r) => r.type === 'expense' && r.status === 'pending').length}</em>}</a>; })}
        </nav>
        <div className="sidebar-bottom"><p>MANAGEMENT</p>{(member.role === 'super_admin' || member.role === 'admin') && <a className="nav-link" href="/admin"><ShieldCheck size={18} /><span>Admin portal</span></a>}<a className="nav-link" href="#settings"><Settings size={18} /><span>Settings</span></a><div className="user-card"><span>{member.displayName.split(/\s+/).map(p=>p[0]).join('').slice(0,2).toUpperCase()}</span><div><strong>{member.displayName}</strong><small>{member.role.replace('_',' ')}</small></div><ChevronRight size={16} /></div></div>
      </aside>

      <section className="content" id="overview">
        <header className="topbar"><div><p>2026/27 SEASON</p><h1>Good afternoon, {displayName}.</h1></div><button className="primary"><Plus size={17} /> Record transaction</button></header>
        <div className="notice"><ShieldCheck size={18} /><span><strong>Private team space.</strong> Only approved RVR 2014 members can view this information.</span></div>
        <div className="fund-grid">
          <article className="balance-card">
            <div className="card-label"><Landmark size={18} /> AVAILABLE TEAM FUND</div><div className="balance-row"><h2>€{(balance/100).toFixed(2)}</h2><span>{balance >= 0 ? 'Healthy' : 'Review'}</span></div>
            <div className="fund-stats"><div><span>Money in</span><strong>€{(income/100).toFixed(2)}</strong><small><ArrowUpRight size={14} /> {rows.filter(r=>r.type==='income').length} contributions</small></div><div><span>Money out</span><strong>€{(expense/100).toFixed(2)}</strong><small><ArrowDownLeft size={14} /> {rows.filter(r=>r.type==='expense').length} expenses</small></div></div>
            <div className="fund-progress"><span style={{ width: `${Math.min(100, income ? (income/190000)*100 : 0)}%` }} /></div><p>{Math.round((income/190000)*100)}% of €1,900 yearly target collected</p>
          </article>
          <article className="collection-card">
            <div className="section-heading"><div><span>SEASON CONTRIBUTIONS</span><h3>{rows.filter(r=>r.type==='income').length} payments recorded</h3></div><a href="/contributions"><ChevronRight size={18} /></a></div>
            <div className="ring-wrap"><div className="ring"><strong>{Math.min(100,Math.round((income/190000)*100))}%</strong><span>of target</span></div><div className="collection-notes"><p><i className="green-dot" /> Received <strong>€{(income/100).toFixed(0)}</strong></p><p><i className="amber-dot" /> Target <strong>€1,900</strong></p></div></div>
            <button className="secondary">View contribution status</button>
          </article>
        </div>
        <div className="dashboard-grid">
          <article className="panel transactions" id="contributions"><div className="section-heading"><div><span>TEAM ACCOUNTS</span><h3>Recent activity</h3></div><a href="#team-fund">View all <ChevronRight size={15} /></a></div><div className="transaction-list">
            {rows.slice(0,4).map((row) => { const positive=row.type==='income'; return <div className="transaction" key={row.id}><span className={positive ? 'transaction-icon in' : 'transaction-icon out'}>{positive ? <ArrowDownLeft size={17} /> : <ArrowUpRight size={17} />}</span><div><strong>{member.role==='parent'&&positive?'Family contribution':row.personName}</strong><small>{row.description} · {row.status}</small></div><time>{row.occurredOn.slice(5)}</time><b className={positive ? 'money-in' : 'money-out'}>{positive?'+':'−'}€{(row.amountCents/100).toFixed(2)}</b></div>;})}
          </div></article>
          <aside className="right-column">
            <article className="panel upcoming" id="calendar"><div className="section-heading"><div><span>UP NEXT</span><h3>Important dates</h3></div><CalendarDays size={19} /></div><div className="date-item"><div><strong>05</strong><span>SEP</span></div><p><b>League season begins</b><small>Saturday · Fixture TBC</small></p></div><div className="date-item"><div><strong>12</strong><span>SEP</span></div><p><b>Parent fund deadline</b><small>€25 season contribution</small></p></div><a href="#calendar">Open team calendar <ChevronRight size={15} /></a></article>
            <article className="quick-links"><a href="https://www.rivervalleyrangers.ie/pitch-locations" target="_blank" rel="noreferrer"><MapPin size={19} /><div><b>Pitch locations</b><span>Home & away directions</span></div><ChevronRight size={16} /></a><a href="https://ddsl.ie/" target="_blank" rel="noreferrer"><ClipboardList size={19} /><div><b>DDSL</b><span>Fixtures, results & tables</span></div><ChevronRight size={16} /></a><a href="#activity-ideas"><Lightbulb size={19} /><div><b>Activity ideas</b><span>3 ideas open for voting</span></div><ChevronRight size={16} /></a></article>
          </aside>
        </div>
      </section>
    </main>
  );
}
