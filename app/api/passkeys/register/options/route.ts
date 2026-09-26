import { generateRegistrationOptions } from '@simplewebauthn/server';
import { getDb } from '../../../../../db';
import { passkeys } from '../../../../../db/schema';
import { requireApprovedMember } from '../../../../lib/authz';
import { saveChallenge, webauthnConfig } from '../../../../lib/passkeys';

export async function POST(request: Request) {
  await requireApprovedMember();
  const config = webauthnConfig(request); const keys = await getDb().select().from(passkeys);
  const options = await generateRegistrationOptions({ rpName: config.rpName, rpID: config.rpID, userName: "Finn's Team owner", userID: new TextEncoder().encode('workspace-owner'), attestationType: 'none', excludeCredentials: keys.map((key) => ({ id: key.credentialId, transports: key.transports as AuthenticatorTransport[] })), authenticatorSelection: { authenticatorAttachment: 'platform', residentKey: 'required', userVerification: 'required' } });
  await saveChallenge('registration', options.challenge);
  return Response.json(options);
}
