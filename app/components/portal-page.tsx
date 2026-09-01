import Image from 'next/image';
import Link from 'next/link';
import {
  Apple,
  ArrowDownLeft,
  Calendar,
  CalendarDays,
  Camera,
  CircleHelp,
  Compass,
  Globe,
  Home,
  Lightbulb,
  LogOut,
  Medal,
  Play,
  ReceiptText,
  ShieldCheck,
  Trophy,
  WalletCards,
  Zap,
} from 'lucide-react';
import { logoutAction } from '../actions';
import { roleLabel, type Member } from '../lib/authz';
import { InactivityTracker } from './inactivity-tracker';

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

export function PortalPage({
  member,
  active,
  eyebrow,
  title,
  action,
  children,
}: {
  member: Member;
  active: string;
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  const initials = member.displayName
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <Link className="brand" href="/portal">
          <Image
            src="/rvr-white.png"
            width={48}
            height={48}
            alt="Rivervalley Rangers AFC crest"
          />
          <div>
            <strong>RVR U13 Major 1</strong>
            <span>2014 Squad · Team Portal</span>
          </div>
        </Link>

        <nav className="sidebar-nav-scroll" aria-label="Portal main navigation">
          <p className="sidebar-nav-heading">Squad & Match Hub</p>
          {squadNavItems.map(([label, href, Icon]) => (
            <Link
              className={active === href ? 'nav-link active' : 'nav-link'}
              href={href}
              key={href}
            >
              <Icon size={17} />
              <span>{label}</span>
            </Link>
          ))}

          <p className="sidebar-nav-heading">Team Admin & Fund</p>
          {adminNavItems.map(([label, href, Icon]) => (
            <Link
              className={active === href ? 'nav-link active' : 'nav-link'}
              href={href}
              key={href}
            >
              <Icon size={17} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <p>MANAGEMENT</p>
          {(member.role === 'super_admin' || member.role === 'admin') && (
            <Link
              className={active === '/admin' ? 'nav-link active' : 'nav-link'}
              href="/admin"
            >
              <ShieldCheck size={18} />
              <span>Admin portal</span>
            </Link>
          )}

          <Link className="nav-link public-hub-link" href="/">
            <Camera size={17} />
            <span>Public Photos Gallery</span>
          </Link>

          <div className="user-card">
            <span>{initials}</span>
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
      <section className="content">
        <header className="topbar">
          <div>
            <p>{eyebrow}</p>
            <h1>{title}</h1>
          </div>
          {action}
        </header>
        {children}
      </section>
      <InactivityTracker />
    </main>
  );
}

export function AccessPending({ member }: { member: Member }) {
  return (
    <main className="pending-page">
      <Image
        src="/rvr-crest.png"
        width={90}
        height={90}
        alt="Rivervalley Rangers AFC crest"
      />
      <p>RVR 2014 TEAM ADMIN</p>
      <h1>Access pending approval</h1>
      <span>
        Your account ({member.email}) is awaiting approval from a Team Super Admin.
      </span>
      <Link href="/">Return to Public Gallery</Link>
    </main>
  );
}
