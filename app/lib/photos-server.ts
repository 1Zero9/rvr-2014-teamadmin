import 'server-only';
import { desc } from 'drizzle-orm';
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
    const rawTitle = titleM ? titleM[1].replace(/ - Google Photos/i, '').trim() : 'RVR Match Photos';

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
    const rows = await db.select().from(photoAlbums).orderBy(desc(photoAlbums.albumDate));

    if (rows.length === 0) {
      // Seed initial albums
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
          .onConflictDoNothing();
      }
      return INITIAL_PHOTO_ALBUMS;
    }

    return rows.map((r) => {
      // Match with known initial albums to preserve complete photo list
      const matchedInitial = INITIAL_PHOTO_ALBUMS.find(
        (init) => init.id === r.id || init.shareUrl === r.shareUrl || init.title === r.title
      );

      const samplePhotos =
        matchedInitial && matchedInitial.samplePhotos && matchedInitial.samplePhotos.length > 0
          ? matchedInitial.samplePhotos
          : [r.coverUrl];

      return {
        id: r.id,
        title: r.title,
        shareUrl: r.shareUrl,
        coverUrl: r.coverUrl,
        photoCount: samplePhotos.length > 1 ? samplePhotos.length : (r.photoCount || 1),
        albumDate: r.albumDate,
        photographer: r.photographer,
        matchOpponent: r.matchOpponent,
        samplePhotos,
        isRvrVerified: isValidRvrAlbum(r.title),
        createdAt: r.createdAt,
      } as PhotoAlbum;
    });
  } catch (err) {
    console.error('Error fetching photo albums from DB, returning defaults:', err);
    return INITIAL_PHOTO_ALBUMS;
  }
}
