'use client';

import { useState } from 'react';
import { startAuthentication, startRegistration } from '@simplewebauthn/browser';

export function PasskeyLoginButton() {
  const [message, setMessage] = useState('');
  async function login() { try { setMessage('Opening Face ID…'); const options = await fetch('/api/passkeys/login/options', { method: 'POST' }).then(async (r) => { if (!r.ok) throw new Error((await r.json()).error); return r.json(); }); const response = await startAuthentication({ optionsJSON: options }); const verified = await fetch('/api/passkeys/login/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(response) }); if (!verified.ok) throw new Error((await verified.json()).error); window.location.href = '/portal'; } catch (error) { setMessage(error instanceof Error ? error.message : 'Passkey login failed.'); } }
  return <><button type="button" className="login-submit-btn" onClick={login}>Unlock with Face ID</button>{message && <p className="login-error-banner">{message}</p>}</>;
}

export function EnrolPasskeyButton() {
  const [message, setMessage] = useState('');
  async function enrol() { try { setMessage('Opening Face ID…'); const options = await fetch('/api/passkeys/register/options', { method: 'POST' }).then(async (r) => { if (!r.ok) throw new Error((await r.json()).error); return r.json(); }); const response = await startRegistration({ optionsJSON: options }); const verified = await fetch('/api/passkeys/register/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(response) }); if (!verified.ok) throw new Error((await verified.json()).error); setMessage('Passkey added. You can now use Face ID to unlock the app.'); } catch (error) { setMessage(error instanceof Error ? error.message : 'Passkey setup failed.'); } }
  return <div className="passkey-enrol"><button type="button" className="install-app-button" onClick={enrol}>Set up Face ID sign-in</button>{message && <span>{message}</span>}</div>;
}
