import Image from 'next/image';
import Link from 'next/link';
import { BarChart3, CalendarDays, Camera, Home } from 'lucide-react';
import { type Member } from '../lib/authz';
import { InstallAppButton } from './install-app-button';
import { EnrolPasskeyButton } from './passkey-buttons';

const navItems = [
  ['Home', '/portal', Home],
  ['Matches', '/fixtures', CalendarDays],
  ['Stats', '/stats', BarChart3],
  ['Albums', '/albums', Camera],
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
            <strong>Finn&apos;s Team</strong>
            <span>Private match desk</span>
          </div>
        </Link>

        <nav className="sidebar-nav-scroll" aria-label="Portal main navigation">
          <p className="sidebar-nav-heading">FINN&apos;S TEAM</p>
          {navItems.map(([label, href, Icon]) => (
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
          <p>OWNER</p>

          <div className="user-card">
            <span>{initials}</span>
            <div>
              <strong>{member.displayName}</strong>
              <small>Private workspace</small>
            </div>
          </div>
        </div>
      </aside>
      <section className="content">
        <header className="topbar">
          <div>
            <p>{eyebrow}</p>
            <h1>{title}</h1>
          </div>
          <div className="topbar-actions"><EnrolPasskeyButton />{action}<InstallAppButton /></div>
        </header>
        {children}
      </section>
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
      <p>FINN&apos;S TEAM</p>
      <h1>Access pending approval</h1>
      <span>
        Your account ({member.email}) is awaiting approval from a Team Super Admin.
      </span>
      <Link href="/">Return to Public Gallery</Link>
    </main>
  );
}
