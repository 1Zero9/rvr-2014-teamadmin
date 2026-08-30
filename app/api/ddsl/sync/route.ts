import { NextResponse } from 'next/server';
import { getMatchesFromDb } from '@/app/lib/matches';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const matchesList = await getMatchesFromDb();
    return NextResponse.json({
      success: true,
      count: matchesList.length,
      syncedAt: new Date().toISOString(),
      source: 'DDSL Official Fixtures & Matchday Centre',
      matches: matchesList,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
