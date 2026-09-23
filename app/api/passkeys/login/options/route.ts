import { generateAuthenticationOptions } from '@simplewebauthn/server';
import { getDb } from '../../../../../db';
import { passkeys } from '../../../../../db/schema';
import { saveChallenge, webauthnConfig } from '../../../../lib/passkeys';

export async function POST(request: Request) {
  const config = webauthnConfig(request); const keys = await getDb().select().from(passkeys);
  if (!keys.length) return Response.json({ error: 'No passkey has been enrolled yet.' }, { status: 404 });
  const options = await generateAuthenticationOptions({ rpID: config.rpID, userVerification: 'required', allowCredentials: keys.map((key) => ({ id: key.credentialId, transports: key.transports as AuthenticatorTransport[] })) });
  await saveChallenge('authentication', options.challenge);
  return Response.json(options);
}
