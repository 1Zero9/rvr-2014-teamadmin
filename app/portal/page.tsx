import Image from 'next/image';
import Link from 'next/link';
import { desc } from 'drizzle-orm';
import {
  Apple,
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  CalendarDays,
  Camera,
  ChevronRight,
  CircleHelp,
  Compass,
  Globe,
  Home,
  Landmark,
  Lightbulb,
  LogOut,
  Medal,
  Play,
  Plus,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Trophy,
  WalletCards,
  Zap,
} from 'lucide-react';
import { getDb } from '../../db';
import { transactions } from '../../db/schema';
import { logoutAction } from '../actions';
import { MatchdayCountdown } from '../components/matchday-countdown';
import { AccessPending } from '../components/portal-page';
import { requireApprovedMember, roleLabel } from '../lib/authz';
import { fetchLiveDdslLeagueData } from '../lib/ddsl-live';

export const dynamic = 'force-dynamic';

const squadNavItems = [
  ['Fixtures & Standings', '/fixtures', Trophy],
  ['Skills Vault', '/skills', Play],
  ['Training & Kit', '/training', Calendar],
  ['Speed & S&C', '/sc', Zap],
  ['Game Day Fuel', '/nutrition', Apple],
  ['Pitch Venues & GPS', '/venues', Compass],
  ['Cups & Blitzes', '/tournaments', Medal],
  ['Squad Photos', '/photos', Camera],
] as const;

const adminNavItems = [
  ['Portal Overview', '/portal', Home],
  ['Team fund', '/fund', WalletCards],
  ['Contributions', '/contributions', ArrowDownLeft],
  ['Expenses', '/expenses', ReceiptText],
  ['Calendar', '/calendar', CalendarDays],
  ['Activity ideas', '/ideas', Lightbulb],
  ['Team information', '/information', CircleHelp],
] as const;

const SQUAD_HUB_CARDS = [
  {
    id: 'fixtures',
    title: 'Fixtures & League Table',
    badge: 'Live DDSL',
    color: 'gold',
    icon: Trophy,
    desc: 'Official DDSL match outcomes, verified full-time scores, upcoming kick-offs, and division standings.',
    href: '/fixtures',
  },
  {
    id: 'skills',
    title: 'Skills Vault & Drills',
    badge: 'Video Drills',
    color: 'cyan',
    icon: Play,
    desc: 'High-energy video masterclasses for 1v1 moves, sharp turns, quick footwork, and top-corner finishing.',
    href: '/skills',
  },
  {
    id: 'training',
    title: 'Training & Match Kit',
    badge: 'Sessions',
    color: 'green',
    icon: Calendar,
    desc: 'Weekly training timetable, pitch allocations, weather notifications, and interactive kit checklist.',
    href: '/training',
  },
  {
    id: 'sc',
    title: 'Speed, Agility & S&C',
    badge: 'Athletic Dev',
    color: 'purple',
    icon: Zap,
    desc: 'Youth athletic development: FIFA 11+ dynamic activation, speed ladder footwork, and core stability.',
    href: '/sc',
  },
  {
    id: 'nutrition',
    title: 'Matchday Fuel & Food',
    badge: 'Player Fuel',
    color: 'orange',
    icon: Apple,
    desc: 'What to eat before kick-off, halftime energy boosters, hydration targets, and fast muscle recovery meals.',
    href: '/nutrition',
  },
  {
    id: 'venues',
    title: 'Pitch Venues & GPS',
    badge: '1-Tap Maps',
    color: 'blue',
    icon: Compass,
    desc: 'Directions, pitch surfaces, footwear recommendations, and one-tap Google/Apple Maps for all grounds.',
    href: '/venues',
  },
  {
    id: 'tournaments',
    title: 'Cups & Blitzes',
    badge: 'Knockout',
    color: 'gold',
    icon: Medal,
    desc: 'DDSL All-Dublin Cup knockout format, extra-time rules, summer blitzes, and squad tour packing lists.',
    href: '/tournaments',
  },
  {
    id: 'photos',
    title: 'Squad Photo Gallery',
    badge: 'HD Gallery',
    color: 'green',
    icon: Camera,
    desc: 'Match action photos, goal celebrations, tournament victories, and squad memories from the season.',
    href: '/photos',
  },
];

export default async function PortalDashboardPage() {
  const member = await requireApprovedMember();
  if (!member.approved) return <AccessPending member={member} />;

  let rows: typeof transactions.$inferSelect[] = [];
  try {
    rows = await getDb().select().from(transactions).orderBy(desc(transactions.occurredOn));
  } catch (err) {
    console.error('Error fetching transactions:', err);
  }

  const liveDdslData = await fetchLiveDdslLeagueData('218148');
  const nextFixture = liveDdslData.rvrMatches.find((m) => m.status === 'upcoming') || {
    opponent: 'Rosemount Mulvey FC',
    matchDate: 'Sat 5th Sept 2026',
    kickoffTime: '10:30 AM',
    venue: 'Rivervalley Park - Pitch 1',
  };

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
        <Link className="brand" href="/portal">
          <Image
            src="/rvr-white.png"
            width={48}
            height={48}
            alt="Rivervalley Rangers AFC crest"
            priority
          />
          <div>
            <strong>RVR U13 Major 1</strong>
            <span>2014 Squad · Team Portal</span>
          </div>
        </Link>

        <nav className="sidebar-nav-scroll" aria-label="Portal navigation">
          <p className="sidebar-nav-heading">Squad & Match Hub</p>
          {squadNavItems.map(([label, href, Icon]) => (
            <Link className="nav-link" href={href} key={label}>
              <Icon size={17} strokeWidth={1.8} />
              <span>{label}</span>
            </Link>
          ))}

          <p className="sidebar-nav-heading">Team Admin & Fund</p>
          {adminNavItems.map(([label, href, Icon], index) => (
            <Link
              className={index === 0 ? 'nav-link active' : 'nav-link'}
              href={href}
              key={label}
            >
              <Icon size={17} strokeWidth={1.8} />
              <span>{label}</span>
              {label === 'Expenses' &&
                rows.some((r) => r.type === 'expense' && r.status === 'pending') && (
                  <em>
                    {rows.filter((r) => r.type === 'expense' && r.status === 'pending').length}
                  </em>
                )}
            </Link>
          ))}
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
            <Camera size={17} />
            <span>Public Photos Gallery</span>
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
            <h1>Welcome back, {displayName}.</h1>
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
            <strong>Private team space.</strong> Only verified RVR 2014 coaches, parents, and administrators can access these squad tools and financial records.
          </span>
        </div>

        {/* Live Matchday Countdown Banner */}
        <div style={{ margin: '20px 0' }}>
          <MatchdayCountdown
            opponent={nextFixture.opponent}
            matchDateStr={nextFixture.matchDate}
            kickoffTime={nextFixture.kickoffTime}
            venue={nextFixture.venue}
          />
        </div>

        {/* Squad & Player Operations Hub Grid */}
        <div className="portal-section-header">
          <h2>
            <Trophy size={20} className="text-amber-500" />
            Squad & Match Operations Hub
          </h2>
          <span className="portal-hub-badge">8 Modules Active</span>
        </div>

        <div className="portal-squad-grid">
          {SQUAD_HUB_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.id} href={card.href} className="portal-hub-card">
                <div>
                  <div className="portal-hub-card-top">
                    <div className={`portal-hub-icon-wrap ${card.color}`}>
                      <Icon size={20} />
                    </div>
                    <span className="portal-hub-badge">{card.badge}</span>
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                </div>
                <div className="portal-hub-card-link">
                  <span>Open module</span>
                  <ArrowRight size={14} />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Financial Overview Header */}
        <div className="portal-section-header">
          <h2>
            <WalletCards size={20} className="text-blue-500" />
            Team Accounts & Fund Administration
          </h2>
          <Link href="/fund" className="portal-hub-card-link">
            <span>Detailed Ledger</span>
            <ChevronRight size={15} />
          </Link>
        </div>

        {/* Fund Balance & Contribution Progress */}
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

        {/* Dashboard Bottom Grid: Transactions & Upcoming Dates */}
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
                  <b>League season kick-off</b>
                  <small>Saturday · Rosemount Mulvey FC</small>
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
                <Camera size={19} />
                <div>
                  <b>Public Photos Gallery</b>
                  <span>Matchday action & albums</span>
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
