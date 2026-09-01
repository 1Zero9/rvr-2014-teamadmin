import 'server-only';
import { desc, eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { photoAlbums } from '@/db/schema';
import { INITIAL_PHOTO_ALBUMS, isValidRvrAlbum, PhotoAlbum } from './photos-data';

export async function parseGooglePhotosAlbum(shareUrl: string): Promise<{
  title: string;
  coverUrl: string;
  photoCount: number;
  samplePhotos: string[];
  isRvrVerified: boolean;
}> {
  try {
    let targetUrl = shareUrl;
    if (shareUrl.includes('photos.app.goo.gl')) {
      const headRes = await fetch(shareUrl, {
        method: 'GET',
        redirect: 'manual',
      });
      const loc = headRes.headers.get('location');
      if (loc) {
        targetUrl = loc;
      }
    }

    const res = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
      },
    });

    const html = await res.text();
    const titleM = html.match(/<title>(.*?)<\/title>/i) || html.match(/<meta property="og:title" content="(.*?)"/i);
    let rawTitle = titleM ? titleM[1].replace(/ - Google Photos/i, '').trim() : 'RVR Match Photos';

    // Format raw title if it has ISO date prefix
    if (rawTitle.includes('2026-08-29') || rawTitle.includes('Greystones')) {
      rawTitle = 'RVR U13 vs Greystones United (Home)';
    } else if (rawTitle.includes('2026-08-25') || rawTitle.includes('Tournament')) {
      rawTitle = 'RVR U13 Pre-Season Home Tournament';
    }

    const isRvrVerified = isValidRvrAlbum(rawTitle);

    const re = /https:\/\/lh3\.googleusercontent\.com\/pw\/([a-zA-Z0-9_\-]+)/g;
    const ids: string[] = [];
    let m;
    while ((m = re.exec(html)) !== null) {
      if (!ids.includes(m[1])) {
        ids.push(m[1]);
      }
    }

    const samplePhotos = ids.length > 0
      ? ids.map((id) => `https://lh3.googleusercontent.com/pw/${id}=w1200`)
      : [];

    const coverUrl = samplePhotos.length > 0
      ? samplePhotos[0]
      : 'https://lh3.googleusercontent.com/pw/AP1GczPWQ1M0XQgCUyIxlzreFY0fQb_nHjes_A9PzrSEb627QCquRNp3-SqtttEnegipFIpyJ7HRcseV183wWPfctXvnb-2_a42Hvlpnz7ekW3XBxhWKnbqi=w1200';

    return {
      title: rawTitle,
      coverUrl,
      photoCount: samplePhotos.length > 0 ? samplePhotos.length : 1,
      samplePhotos,
      isRvrVerified,
    };
  } catch (error) {
    console.error('Error parsing Google Photos album:', error);
    return {
      title: 'RVR Match Photos',
      coverUrl: 'https://lh3.googleusercontent.com/pw/AP1GczPWQ1M0XQgCUyIxlzreFY0fQb_nHjes_A9PzrSEb627QCquRNp3-SqtttEnegipFIpyJ7HRcseV183wWPfctXvnb-2_a42Hvlpnz7ekW3XBxhWKnbqi=w1200',
      photoCount: 1,
      samplePhotos: [],
      isRvrVerified: true,
    };
  }
}

export async function getPhotoAlbumsFromDb(): Promise<PhotoAlbum[]> {
  try {
    const db = getDb();

    // Ensure database rows have the updated clean titles and distinct covers
    for (const item of INITIAL_PHOTO_ALBUMS) {
      await db
        .insert(photoAlbums)
        .values({
          id: item.id,
          title: item.title,
          shareUrl: item.shareUrl,
          coverUrl: item.coverUrl,
          photoCount: item.photoCount,
          albumDate: item.albumDate,
          photographer: item.photographer,
          matchOpponent: item.matchOpponent,
          createdAt: item.createdAt,
        })
        .onConflictDoUpdate({
          target: photoAlbums.id,
          set: {
            title: item.title,
            coverUrl: item.coverUrl,
            photoCount: item.photoCount,
            matchOpponent: item.matchOpponent,
          },
        });
    }

    const rows = await db.select().from(photoAlbums).orderBy(desc(photoAlbums.albumDate));

    return rows.map((r) => {
      // Match with known initial albums to preserve complete photo list & clean title
      const matchedInitial = INITIAL_PHOTO_ALBUMS.find(
        (init) =>
          init.id === r.id ||
          init.shareUrl === r.shareUrl ||
          r.shareUrl.includes('nn4kZwjcy5eLXyMA9') && init.id.includes('greystones') ||
          r.shareUrl.includes('wzUJycZj1Bj6iw138') && init.id.includes('tournament')
      );

      const title = matchedInitial ? matchedInitial.title : r.title;
      const coverUrl = matchedInitial ? matchedInitial.coverUrl : r.coverUrl;
      const samplePhotos =
        matchedInitial && matchedInitial.samplePhotos && matchedInitial.samplePhotos.length > 0
          ? matchedInitial.samplePhotos
          : [coverUrl];

      return {
        id: r.id,
        title,
        shareUrl: r.shareUrl,
        coverUrl,
        photoCount: samplePhotos.length > 1 ? samplePhotos.length : (r.photoCount || 1),
        albumDate: r.albumDate,
        photographer: r.photographer || 'Brian (Official Team Photographer)',
        matchOpponent: r.matchOpponent || title,
        samplePhotos,
        isRvrVerified: isValidRvrAlbum(title),
        createdAt: r.createdAt,
      } as PhotoAlbum;
    });
  } catch (err) {
    console.error('Error fetching photo albums from DB, returning defaults:', err);
    return INITIAL_PHOTO_ALBUMS;
  }
}
