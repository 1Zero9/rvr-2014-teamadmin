import { redirect } from 'next/navigation';
import { loginAction } from '../actions';
import { getCurrentMember } from '../lib/authz';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await getCurrentMember()) redirect('/portal');
  const { error } = await searchParams;
  return (
    <main className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <span className="login-badge">RVR U13 · PRIVATE WORKSPACE</span>
          <h1>Match desk</h1>
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
      </div>
    </main>
  );
}
