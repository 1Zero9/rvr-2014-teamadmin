import { NextResponse } from 'next/server';
import { fetchLiveDdslLeagueData } from '@/app/lib/ddsl-live';
import { getDb } from '@/db';
import { matches } from '@/db/schema';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await fetchLiveDdslLeagueData('218148');
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
