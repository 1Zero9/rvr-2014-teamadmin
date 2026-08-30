import 'server-only';
import { desc } from 'drizzle-orm';
import { getDb } from '@/db';
import { matches } from '@/db/schema';
import { INITIAL_DDSL_MATCHES, MatchRecord } from './matches-data';

export * from './matches-data';

export async function getMatchesFromDb(): Promise<MatchRecord[]> {
  try {
    const db = getDb();
    const rows = await db.select().from(matches).orderBy(desc(matches.matchDate));

    if (rows.length === 0) {
      // Seed initial matches if table is empty
      const now = new Date().toISOString();
      for (const item of INITIAL_DDSL_MATCHES) {
        await db.insert(matches).values({
          ...item,
          syncedAt: now,
          createdAt: now,
        }).onConflictDoNothing();
      }
      return await db.select().from(matches).orderBy(desc(matches.matchDate));
    }

    return rows as MatchRecord[];
  } catch (err) {
    console.error('Error fetching matches from DB, returning fallback data:', err);
    const now = new Date().toISOString();
    return INITIAL_DDSL_MATCHES.map((m) => ({
      ...m,
      syncedAt: now,
      createdAt: now,
    }));
  }
}
