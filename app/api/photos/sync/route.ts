import { NextRequest, NextResponse } from 'next/server';
import { isValidRvrAlbum } from '@/app/lib/photos-data';
import { getPhotoAlbumsFromDb, parseGooglePhotosAlbum } from '@/app/lib/photos-server';
import { getCurrentMember } from '@/app/lib/authz';
import { getDb } from '@/db';
import { photoAlbums } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

// Manual "check for new photos" refresh, triggered from the gallery UI
export async function GET() {
  try {
    const db = getDb();
    const existing = await getPhotoAlbumsFromDb();

    // Re-verify and sync known Google Photos shared albums
    let updatedCount = 0;
    for (const album of existing) {
      if (album.shareUrl && album.shareUrl.startsWith('http')) {
        const parsed = await parseGooglePhotosAlbum(album.shareUrl);
        if (parsed.isRvrVerified && parsed.photoCount > 0) {
          await db
            .insert(photoAlbums)
            .values({
              id: album.id,
              title: parsed.title,
              shareUrl: album.shareUrl,
              coverUrl: parsed.coverUrl,
              photoCount: parsed.photoCount,
              albumDate: album.albumDate,
              photographer: album.photographer,
              matchOpponent: album.matchOpponent || parsed.title,
              createdAt: album.createdAt,
            })
            .onConflictDoUpdate({
              target: photoAlbums.id,
              set: {
                title: parsed.title,
                coverUrl: parsed.coverUrl,
                photoCount: parsed.photoCount,
              },
            });
          updatedCount++;
        }
      }
    }

    const latestAlbums = await getPhotoAlbumsFromDb();

    return NextResponse.json({
      success: true,
      message: `Checked and synced ${updatedCount} RVR Google Photos albums`,
      count: latestAlbums.length,
      albums: latestAlbums,
      lastSync: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const member = await getCurrentMember();
    if (!member) {
      return NextResponse.json({ success: false, error: 'You must be signed in to add an album.' }, { status: 401 });
    }

    const body = await req.json();
    const { shareUrl, title: customTitle } = body;

    if (!shareUrl || (!shareUrl.includes('photos.app.goo.gl') && !shareUrl.includes('photos.google.com'))) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid Google Photos shared link (e.g. https://photos.app.goo.gl/...)' },
        { status: 400 }
      );
    }

    const parsed = await parseGooglePhotosAlbum(shareUrl);
    const finalTitle = customTitle || parsed.title;

    // Strict validation: Only accept football match albums containing 'RVR'
    if (!isValidRvrAlbum(finalTitle)) {
      return NextResponse.json(
        {
          success: false,
          error: `Album title "${finalTitle}" was rejected. To ensure only official RVR football photos are published, the album title must contain "RVR" (e.g., "2026-08-29 RVR U13 vs Greystones").`,
        },
        { status: 400 }
      );
    }

    const db = getDb();
    const now = new Date().toISOString();
    const albumId = `album-${Date.now()}`;

    const newAlbum = {
      id: albumId,
      title: finalTitle,
      shareUrl,
      coverUrl: parsed.coverUrl,
      photoCount: parsed.photoCount,
      albumDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      photographer: 'RVR Team',
      matchOpponent: finalTitle,
      createdAt: now,
    };

    await db.insert(photoAlbums).values(newAlbum).onConflictDoNothing();

    return NextResponse.json({
      success: true,
      message: `Verified RVR football album published successfully!`,
      album: {
        ...newAlbum,
        samplePhotos: parsed.samplePhotos,
        isRvrVerified: true,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const member = await getCurrentMember();
    if (!member) {
      return NextResponse.json({ success: false, error: 'You must be signed in to remove an album.' }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'Album id is required.' }, { status: 400 });
    }

    const db = getDb();
    await db.delete(photoAlbums).where(eq(photoAlbums.id, id));

    return NextResponse.json({ success: true, message: 'Album removed.' });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
