import { NextRequest, NextResponse } from 'next/server';
import { getPhotoAlbumsFromDb, parseGooglePhotosAlbum } from '@/app/lib/photos-server';
import { getDb } from '@/db';
import { photoAlbums } from '@/db/schema';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const albums = await getPhotoAlbumsFromDb();
    return NextResponse.json({ success: true, albums });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { shareUrl, title: customTitle, photographer = 'Team Dad & Official Photographer' } = body;

    if (!shareUrl || !shareUrl.includes('photos.app.goo.gl') && !shareUrl.includes('photos.google.com')) {
      return NextResponse.json({ success: false, error: 'Valid Google Photos share link required' }, { status: 400 });
    }

    const parsed = await parseGooglePhotosAlbum(shareUrl);
    const db = getDb();
    const now = new Date().toISOString();
    const albumId = `album-${Date.now()}`;

    const newAlbum = {
      id: albumId,
      title: customTitle || parsed.title,
      shareUrl,
      coverUrl: parsed.coverUrl,
      photoCount: parsed.photoCount,
      albumDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      photographer,
      matchOpponent: customTitle || parsed.title,
      createdAt: now,
    };

    await db.insert(photoAlbums).values(newAlbum).onConflictDoNothing();

    return NextResponse.json({
      success: true,
      album: {
        ...newAlbum,
        samplePhotos: parsed.samplePhotos,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
