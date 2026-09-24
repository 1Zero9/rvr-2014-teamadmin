import { eq } from 'drizzle-orm';
import { getDb } from '../../db';
import { passkeyChallenges } from '../../db/schema';

export function webauthnConfig(request: Request) {
  const url = new URL(request.url);
  return { rpID: url.hostname, origin: url.origin, rpName: "Finn's Football" };
}

export async function saveChallenge(purpose: string, challenge: string) {
  const expiresAt = new Date(Date.now() + 5 * 60_000).toISOString();
  await getDb().insert(passkeyChallenges).values({ purpose, challenge, expiresAt }).onConflictDoUpdate({ target: passkeyChallenges.purpose, set: { challenge, expiresAt } });
}

export async function consumeChallenge(purpose: string) {
  const db = getDb();
  const [row] = await db.select().from(passkeyChallenges).where(eq(passkeyChallenges.purpose, purpose));
  await db.delete(passkeyChallenges).where(eq(passkeyChallenges.purpose, purpose));
  return row && new Date(row.expiresAt).getTime() > Date.now() ? row.challenge : null;
}
