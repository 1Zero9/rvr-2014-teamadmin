import Image from 'next/image';
import { redirect } from 'next/navigation';
import { loginAction } from '../actions';
import { getCurrentMember } from '../lib/authz';
import { getAppVersion } from '../lib/version';
import { PasskeyLoginButton } from '../components/passkey-buttons';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await getCurrentMember()) redirect('/portal');
  const { error } = await searchParams;
  return (
    <main className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <div className="login-crest-wrap">
            <Image src="/rvr-crest.png" width={76} height={76} alt="Rivervalley Rangers AFC crest" priority />
          </div>
          <span className="login-badge">FINN&apos;S TEAM · PRIVATE APP</span>
          <h1>Finn&apos;s Team</h1>
          <p>Enter your private workspace password.</p>
        </div>
        {error === 'invalid' && <p className="login-error-banner">That password is not correct.</p>}
        <form action={loginAction} className="login-form">
          <div className="login-field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" autoFocus required />
          </div>
          <button type="submit" className="login-submit-btn">Open workspace</button>
        </form>
        <div className="passkey-login"><span>or</span><PasskeyLoginButton /></div>
        <p className="app-version login-version">v{getAppVersion()}</p>
      </div>
    </main>
  );
}
