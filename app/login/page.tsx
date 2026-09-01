import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AlertCircle, ArrowLeft, KeyRound, Lock, ShieldCheck } from 'lucide-react';
import { loginAction } from '../actions';
import { getCurrentMember } from '../lib/authz';

export const dynamic = 'force-dynamic';

interface LoginPageProps {
  searchParams?: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const current = await getCurrentMember();
  if (current) {
    redirect('/portal');
  }

  const resolvedParams = searchParams ? await searchParams : {};
  const errorCode = resolvedParams?.error;

  return (
    <main className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <Link href="/" className="login-back-link">
            <ArrowLeft size={16} /> Back to Public Gallery
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
            <Lock size={12} /> RESTRICTED SQUAD & ADMIN ACCESS
          </span>
          <h1>Team Admin Portal</h1>
          <p>
            Enter your team passcode to access DDSL fixtures, skills drills, training schedule, squad finances, and management controls.
          </p>
        </div>

        {errorCode && (
          <div className={`login-error-banner ${errorCode === 'timeout' ? 'timeout-banner' : ''}`}>
            <AlertCircle size={16} />
            <span>
              {errorCode === 'timeout'
                ? 'Session expired due to inactivity. Please enter your password to unlock the portal.'
                : errorCode === 'missing'
                ? 'Please enter the admin password.'
                : 'Incorrect admin password. Please check your credentials.'}
            </span>
          </div>
        )}

        <form action={loginAction} className="login-form">
          <div className="login-field">
            <label htmlFor="passcode">Admin Portal Password</label>
            <div className="input-icon-wrap">
              <KeyRound size={17} />
              <input
                id="passcode"
                name="passcode"
                type="password"
                placeholder="Enter password..."
                required
                autoFocus
              />
            </div>
          </div>

          <button type="submit" className="login-submit-btn">
            <Lock size={16} /> Unlock Team Portal
          </button>
        </form>

        <div className="login-footer">
          <p>
            Rivervalley Rangers 2014 Squad · Swords, Dublin
          </p>
          <small>
            Protected by <code>ADMIN_PASSWORD</code> environment variable.
          </small>
        </div>
      </div>
    </main>
  );
}
