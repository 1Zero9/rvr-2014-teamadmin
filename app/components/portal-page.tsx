import Image from 'next/image';
import Link from 'next/link';
import { ArrowDownLeft, CalendarDays, CircleHelp, Home, Lightbulb, ReceiptText, Settings, ShieldCheck, WalletCards } from 'lucide-react';
import { roleLabel, type Member } from '../lib/authz';

const items = [
  ['Overview', '/', Home], ['Team fund', '/fund', WalletCards], ['Contributions', '/contributions', ArrowDownLeft],
  ['Expenses', '/expenses', ReceiptText], ['Calendar', '/calendar', CalendarDays], ['Activity ideas', '/ideas', Lightbulb], ['Team information', '/information', CircleHelp],
] as const;

export function PortalPage({ member, active, eyebrow, title, action, children }: { member: Member; active: string; eyebrow: string; title: string; action?: React.ReactNode; children: React.ReactNode }) {
  const initials = member.displayName.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  return <main className="app-shell"><aside className="sidebar"><Link className="brand" href="/"><Image src="/rvr-white.png" width={52} height={52} alt="Rivervalley Rangers AFC crest" /><div><strong>RVR 2014</strong><span>Team Admin</span></div></Link><nav>{items.map(([label, href, Icon]) => <Link className={active === href ? 'nav-link active' : 'nav-link'} href={href} key={href}><Icon size={18} /><span>{label}</span></Link>)}</nav><div className="sidebar-bottom"><p>MANAGEMENT</p>{(member.role === 'super_admin' || member.role === 'admin') && <Link className={active === '/admin' ? 'nav-link active' : 'nav-link'} href="/admin"><ShieldCheck size={18} /><span>Admin portal</span></Link>}<a className="nav-link" href="#settings"><Settings size={18} /><span>Settings</span></a><div className="user-card"><span>{initials}</span><div><strong>{member.displayName}</strong><small>{roleLabel(member.role)}</small></div></div></div></aside><section className="content"><header className="topbar"><div><p>{eyebrow}</p><h1>{title}</h1></div>{action}</header>{children}</section></main>;
}

export function AccessPending({ member }: { member: Member }) { return <main className="pending-page"><Image src="/rvr-crest.png" width={90} height={90} alt="Rivervalley Rangers AFC crest" /><p>RVR 2014 TEAM ADMIN</p><h1>Access awaiting approval</h1><span>{member.email} has signed in successfully. A team administrator needs to approve your membership before you can see private team information.</span><a href="/signout-with-chatgpt?return_to=/">Sign out</a></main>; }
