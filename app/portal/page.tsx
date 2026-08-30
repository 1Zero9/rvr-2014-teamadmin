import Image from 'next/image';
import Link from 'next/link';
import { desc } from 'drizzle-orm';
import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  CircleHelp,
  Globe,
  Home,
  Landmark,
  Lightbulb,
  LogOut,
  Plus,
  ReceiptText,
  ShieldCheck,
  WalletCards,
} from 'lucide-react';
import { getDb } from '../../db';
import { transactions } from '../../db/schema';
import { logoutAction } from '../actions';
import { AccessPending } from '../components/portal-page';
import { requireApprovedMember, roleLabel } from '../lib/authz';

export const dynamic = 'force-dynamic';

const nav = [
  ['Portal Overview', '/portal', Home],
  ['Team fund', '/fund', WalletCards],
  ['Contributions', '/contributions', ArrowDownLeft],
  ['Expenses', '/expenses', ReceiptText],
  ['Calendar', '/calendar', CalendarDays],
  ['Activity ideas', '/ideas', Lightbulb],
  ['Team information', '/information', CircleHelp],
] as const;

export default async function PortalDashboardPage() {
  const member = await requireApprovedMember();
  if (!member.approved) return <AccessPending member={member} />;

  let rows: typeof transactions.$inferSelect[] = [];
  try {
    rows = await getDb().select().from(transactions).orderBy(desc(transactions.occurredOn));
  } catch (err) {
    console.error('Error fetching transactions:', err);
  }

  const income = rows
    .filter((r) => r.type === 'income' && r.status !== 'rejected')
    .reduce((sum, r) => sum + r.amountCents, 0);
  const expense = rows
    .filter((r) => r.type === 'expense' && (r.status === 'approved' || r.status === 'paid'))
    .reduce((sum, r) => sum + r.amountCents, 0);
  const balance = income - expense;
  const displayName = member.displayName.split(' ')[0];

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <Link className="brand" href="/">
          <Image
            src="/rvr-white.png"
            width={50}
            height={50}
            alt="Rivervalley Rangers AFC crest"
            priority
          />
          <div>
            <strong>RVR 2014</strong>
            <span>Team Admin & Fund</span>
          </div>
        </Link>

        <nav aria-label="Portal navigation">
          {nav.map(([label, href, Icon], index) => {
            return (
              <Link
                className={index === 0 ? 'nav-link active' : 'nav-link'}
                href={href}
                key={label}
              >
                <Icon size={18} strokeWidth={1.8} />
                <span>{label}</span>
                {label === 'Expenses' &&
                  rows.some((r) => r.type === 'expense' && r.status === 'pending') && (
                    <em>
                      {rows.filter((r) => r.type === 'expense' && r.status === 'pending').length}
                    </em>
                  )}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <p>MANAGEMENT</p>
          {(member.role === 'super_admin' || member.role === 'admin') && (
            <Link className="nav-link" href="/admin">
              <ShieldCheck size={18} />
              <span>Admin portal</span>
            </Link>
          )}

          <Link className="nav-link public-hub-link" href="/">
            <Globe size={18} />
            <span>Public Team Hub</span>
          </Link>

          <div className="user-card">
            <span>
              {member.displayName
                .split(/\s+/)
                .map((p) => p[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </span>
            <div>
              <strong>{member.displayName}</strong>
              <small>{roleLabel(member.role)}</small>
            </div>
            <form action={logoutAction}>
              <button type="submit" title="Sign out" className="logout-icon-btn">
                <LogOut size={16} />
              </button>
            </form>
          </div>
        </div>
      </aside>

      <section className="content" id="overview">
        <header className="topbar">
          <div>
            <p>2026/27 SEASON · PRIVATE TEAM PORTAL</p>
            <h1>Good afternoon, {displayName}.</h1>
          </div>
          {member.role !== 'parent' && (
            <Link href="/expenses" className="primary">
              <Plus size={17} /> Record transaction
            </Link>
          )}
        </header>

        <div className="notice">
          <ShieldCheck size={18} />
          <span>
            <strong>Private team space.</strong> Only verified RVR 2014 coaches, parents, and administrators can view this information.
          </span>
        </div>

        <div className="fund-grid">
          <article className="balance-card">
            <div className="card-label">
              <Landmark size={18} /> AVAILABLE TEAM FUND
            </div>
            <div className="balance-row">
              <h2>€{(balance / 100).toFixed(2)}</h2>
              <span>{balance >= 0 ? 'Healthy' : 'Review'}</span>
            </div>
            <div className="fund-stats">
              <div>
                <span>Money in</span>
                <strong>€{(income / 100).toFixed(2)}</strong>
                <small>
                  <ArrowUpRight size={14} /> {rows.filter((r) => r.type === 'income').length} contributions
                </small>
              </div>
              <div>
                <span>Money out</span>
                <strong>€{(expense / 100).toFixed(2)}</strong>
                <small>
                  <ArrowDownLeft size={14} /> {rows.filter((r) => r.type === 'expense').length} expenses
                </small>
              </div>
            </div>
            <div className="fund-progress">
              <span
                style={{
                  width: `${Math.min(100, income ? (income / 190000) * 100 : 0)}%`,
                }}
              />
            </div>
            <p>{Math.round((income / 190000) * 100)}% of €1,900 yearly target collected</p>
          </article>

          <article className="collection-card">
            <div className="section-heading">
              <div>
                <span>SEASON CONTRIBUTIONS</span>
                <h3>{rows.filter((r) => r.type === 'income').length} payments recorded</h3>
              </div>
              <Link href="/contributions">
                <ChevronRight size={18} />
              </Link>
            </div>
            <div className="ring-wrap">
              <div className="ring">
                <strong>{Math.min(100, Math.round((income / 190000) * 100))}%</strong>
                <span>of target</span>
              </div>
              <div className="collection-notes">
                <p>
                  <i className="green-dot" /> Received <strong>€{(income / 100).toFixed(0)}</strong>
                </p>
                <p>
                  <i className="amber-dot" /> Target <strong>€1,900</strong>
                </p>
              </div>
            </div>
            <Link href="/contributions" className="secondary" style={{ textAlign: 'center', display: 'block' }}>
              View contribution status
            </Link>
          </article>
        </div>

        <div className="dashboard-grid">
          <article className="panel transactions" id="contributions">
            <div className="section-heading">
              <div>
                <span>TEAM ACCOUNTS</span>
                <h3>Recent activity</h3>
              </div>
              <Link href="/fund" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                View all <ChevronRight size={15} />
              </Link>
            </div>
            <div className="transaction-list">
              {rows.length === 0 ? (
                <div className="empty-state">
                  <WalletCards />
                  <strong>No transactions recorded yet</strong>
                  <p>Transactions will appear as contributions and expenses are added.</p>
                </div>
              ) : (
                rows.slice(0, 4).map((row) => {
                  const positive = row.type === 'income';
                  return (
                    <div className="transaction" key={row.id}>
                      <span
                        className={
                          positive ? 'transaction-icon in' : 'transaction-icon out'
                        }
                      >
                        {positive ? <ArrowDownLeft size={17} /> : <ArrowUpRight size={17} />}
                      </span>
                      <div>
                        <strong>
                          {member.role === 'parent' && positive
                            ? 'Family contribution'
                            : row.personName}
                        </strong>
                        <small>
                          {row.description} · {row.status}
                        </small>
                      </div>
                      <time>{row.occurredOn.slice(5)}</time>
                      <b className={positive ? 'money-in' : 'money-out'}>
                        {positive ? '+' : '−'}€{(row.amountCents / 100).toFixed(2)}
                      </b>
                    </div>
                  );
                })
              )}
            </div>
          </article>

          <aside className="right-column">
            <article className="panel upcoming" id="calendar">
              <div className="section-heading">
                <div>
                  <span>UP NEXT</span>
                  <h3>Important dates</h3>
                </div>
                <CalendarDays size={19} />
              </div>
              <div className="date-item">
                <div>
                  <strong>05</strong>
                  <span>SEP</span>
                </div>
                <p>
                  <b>League season begins</b>
                  <small>Saturday · Fixture TBC</small>
                </p>
              </div>
              <div className="date-item">
                <div>
                  <strong>12</strong>
                  <span>SEP</span>
                </div>
                <p>
                  <b>Parent fund deadline</b>
                  <small>€25 season contribution</small>
                </p>
              </div>
              <Link href="/calendar" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                Open team calendar <ChevronRight size={15} />
              </Link>
            </article>

            <article className="quick-links">
              <Link href="/information">
                <CircleHelp size={19} />
                <div>
                  <b>Club information</b>
                  <span>Safeguarding, DDSL & pitch notes</span>
                </div>
                <ChevronRight size={16} />
              </Link>
              <Link href="/ideas">
                <Lightbulb size={19} />
                <div>
                  <b>Activity ideas</b>
                  <span>Vote on team outings and events</span>
                </div>
                <ChevronRight size={16} />
              </Link>
              <Link href="/">
                <Globe size={19} />
                <div>
                  <b>Public Team Hub</b>
                  <span>Skills, Nutrition, S&C, Venues</span>
                </div>
                <ChevronRight size={16} />
              </Link>
            </article>
          </aside>
        </div>
      </section>
    </main>
  );
}
