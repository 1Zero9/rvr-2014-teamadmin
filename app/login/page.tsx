import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, KeyRound, Lock, ShieldCheck, UserCheck, Users } from 'lucide-react';
import { loginAction } from '../actions';
import { getCurrentMember } from '../lib/authz';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  const current = await getCurrentMember();
  if (current) {
    redirect('/portal');
  }

  return (
    <main className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <Link href="/" className="login-back-link">
            <ArrowLeft size={16} /> Back to Public Hub
          </Link>
          <div className="login-crest-wrap">
            <Image
              src="/rvr-crest.png"
              width={76}
              height={76}
              alt="Rivervalley Rangers AFC crest"
              priority
            />
          </div>
          <span className="login-badge">
            <Lock size={12} /> RESTRICTED ACCESS
          </span>
          <h1>RVR 2014 Team Portal</h1>
          <p>
            Private financial ledger, parent contribution tracking, expense approvals, and admin controls.
          </p>
        </div>

        <form action={loginAction} className="login-form">
          <div className="login-field">
            <label htmlFor="passcode">Team Passcode or Member Email</label>
            <div className="input-icon-wrap">
              <KeyRound size={17} />
              <input
                id="passcode"
                name="passcode"
                type="password"
                placeholder="Enter team passcode (e.g. RVR2014Admin)"
                autoFocus
              />
            </div>
          </div>

          <div className="role-presets">
            <p className="presets-title">Quick Access by Role:</p>
            <div className="preset-grid">
              <button
                type="submit"
                name="role"
                value="parent"
                className="preset-btn parent"
              >
                <Users size={16} />
                <div>
                  <strong>Parent View</strong>
                  <small>Accounts & Dates</small>
                </div>
              </button>

              <button
                type="submit"
                name="role"
                value="coach"
                className="preset-btn coach"
              >
                <UserCheck size={16} />
                <div>
                  <strong>Coach View</strong>
                  <small>Expenses & Requests</small>
                </div>
              </button>

              <button
                type="submit"
                name="role"
                value="super_admin"
                className="preset-btn admin"
              >
                <ShieldCheck size={16} />
                <div>
                  <strong>Admin View</strong>
                  <small>Full Control & Ledger</small>
                </div>
              </button>
            </div>
          </div>

          <button type="submit" className="login-submit-btn">
            <Lock size={16} /> Unlock Team Portal
          </button>
        </form>

        <div className="login-footer">
          <p>
            Rivervalley Rangers 2014 Boys & Girls · Swords, Dublin
          </p>
          <small>
            For access credentials, contact your squad coach or team administrator.
          </small>
        </div>
      </div>
    </main>
  );
}
