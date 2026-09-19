import { NextRequest, NextResponse } from 'next/server';
import { fetchLiveDdslLeagueData } from '@/app/lib/ddsl-live';
import { getCurrentMember } from '@/app/lib/authz';
import { getDb } from '@/db';
import { matches } from '@/db/schema';

export const dynamic = 'force-dynamic';

// This route writes to the database and was previously callable by anyone
// on the internet with no auth at all. Vercel's Cron Jobs call it with
// `Authorization: Bearer $CRON_SECRET` (set CRON_SECRET in the project's
// env vars - Vercel injects it into every cron invocation automatically
// once it exists); the "Sync Live DDSL" button in the fixtures UI calls it
// from an already-authenticated member's browser session instead, so both
// paths need to be accepted here.
async function isAuthorized(request: NextRequest): Promise<boolean> {
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`) {
    return true;
  }
  const member = await getCurrentMember();
  return member !== null;
}

export async function GET(request: NextRequest) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await fetchLiveDdslLeagueData('218148');

    // fetchLiveDdslLeagueData no longer throws on a failed fetch/parse - it
    // catches internally and returns an honest empty result with `.error`
    // set, so this route's own try/catch never sees it. Check explicitly,
    // or a DDSL outage would report success:true with zero matches synced.
    if (data.error) {
      return NextResponse.json({ success: false, error: data.error }, { status: 502 });
    }

    const db = getDb();

    // Upsert RVR matches into database
    for (const match of data.rvrMatches) {
      await db.insert(matches).values({
        id: match.id,
        opponent: match.opponent,
        competition: match.competition,
        matchDate: match.matchDate,
        kickoffTime: match.kickoffTime,
        venue: match.venue,
        homeAway: match.homeAway,
        status: match.status,
        rvrGoals: match.rvrGoals,
        opponentGoals: match.opponentGoals,
        scorers: match.scorers,
        potm: match.potm,
        matchNotes: match.matchNotes,
        ddslMatchId: match.ddslMatchId,
        syncedAt: data.syncedAt,
        createdAt: match.createdAt,
      }).onConflictDoNothing();
    }

    return NextResponse.json({
      success: true,
      leagueName: data.leagueName,
      leagueUrl: data.leagueUrl,
      rvrCount: data.rvrMatches.length,
      allCount: data.allDivisionMatches.length,
      standingsCount: data.standings.length,
      syncedAt: data.syncedAt,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
