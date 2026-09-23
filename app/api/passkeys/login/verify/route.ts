import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import { eq } from 'drizzle-orm';
import { getDb } from '../../../../../db';
import { passkeys } from '../../../../../db/schema';
import { AUTH_COOKIE_NAME, createSessionValue } from '../../../../lib/authz';
import { consumeChallenge, webauthnConfig } from '../../../../lib/passkeys';

export async function POST(request: Request) {
  const expectedChallenge = await consumeChallenge('authentication');
  const responseJSON = await request.json();
  const [key] = await getDb().select().from(passkeys).where(eq(passkeys.credentialId, responseJSON.id));
  if (!expectedChallenge || !key) return Response.json({ error: 'This passkey request expired. Try again.' }, { status: 400 });
  try {
    const config = webauthnConfig(request);
    const verification = await verifyAuthenticationResponse({ response: responseJSON, expectedChallenge, expectedOrigin: config.origin, expectedRPID: config.rpID, credential: { id: key.credentialId, publicKey: Buffer.from(key.publicKey, 'base64url'), counter: key.counter, transports: key.transports as AuthenticatorTransport[] }, requireUserVerification: true });
    if (!verification.verified) return Response.json({ error: 'Passkey verification failed.' }, { status: 400 });
    await getDb().update(passkeys).set({ counter: verification.authenticationInfo.newCounter, lastUsedAt: new Date().toISOString() }).where(eq(passkeys.id, key.id));
    const reply = Response.json({ verified: true });
    reply.headers.append('Set-Cookie', `${AUTH_COOKIE_NAME}=${createSessionValue()}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`);
    return reply;
  } catch (error) { console.error('Passkey login failed:', error); return Response.json({ error: 'Passkey login could not be verified.' }, { status: 400 }); }
}
