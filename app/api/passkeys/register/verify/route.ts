import { verifyRegistrationResponse } from '@simplewebauthn/server';
import { getDb } from '../../../../../db';
import { passkeys } from '../../../../../db/schema';
import { requireApprovedMember } from '../../../../lib/authz';
import { consumeChallenge, webauthnConfig } from '../../../../lib/passkeys';

export async function POST(request: Request) {
  await requireApprovedMember();
  const expectedChallenge = await consumeChallenge('registration');
  if (!expectedChallenge) return Response.json({ error: 'This passkey setup expired. Try again.' }, { status: 400 });
  try {
    const verification = await verifyRegistrationResponse({ response: await request.json(), expectedChallenge, expectedOrigin: webauthnConfig(request).origin, expectedRPID: webauthnConfig(request).rpID, requireUserVerification: true });
    if (!verification.verified || !verification.registrationInfo) return Response.json({ error: 'Passkey verification failed.' }, { status: 400 });
    const credential = verification.registrationInfo.credential;
    await getDb().insert(passkeys).values({ id: crypto.randomUUID(), credentialId: credential.id, publicKey: Buffer.from(credential.publicKey).toString('base64url'), counter: credential.counter, transports: credential.transports || [], createdAt: new Date().toISOString(), lastUsedAt: null });
    return Response.json({ verified: true });
  } catch (error) { console.error('Passkey registration failed:', error); return Response.json({ error: 'Passkey setup could not be verified.' }, { status: 400 }); }
}
