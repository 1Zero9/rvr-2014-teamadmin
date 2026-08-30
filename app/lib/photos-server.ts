import 'server-only';
import { desc } from 'drizzle-orm';
import { getDb } from '@/db';
import { photoAlbums } from '@/db/schema';
import { INITIAL_PHOTO_ALBUMS, PhotoAlbum } from './photos-data';

export async function parseGooglePhotosAlbum(shareUrl: string): Promise<{
  title: string;
  coverUrl: string;
  photoCount: number;
  samplePhotos: string[];
}> {
  try {
    const res = await fetch(shareUrl, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
      },
    });

    const html = await res.text();
    const titleM = html.match(/<title>(.*?)<\/title>/i) || html.match(/<meta property="og:title" content="(.*?)"/i);
    const title = titleM ? titleM[1].replace(/ - Google Photos/i, '').trim() : 'RVR U13 Matchday Photos';

    const re = /https:\/\/lh3\.googleusercontent\.com\/pw\/([a-zA-Z0-9_\-]+)/g;
    const ids: string[] = [];
    let m;
    while ((m = re.exec(html)) !== null) {
      if (!ids.includes(m[1])) {
        ids.push(m[1]);
      }
    }

    const coverUrl = ids.length > 0
      ? `https://lh3.googleusercontent.com/pw/${ids[0]}=w1200`
      : 'https://lh3.googleusercontent.com/pw/AP1GczPWQ1M0XQgCUyIxlzreFY0fQb_nHjes_A9PzrSEb627QCquRNp3-SqtttEnegipFIpyJ7HRcseV183wWPfctXvnb-2_a42Hvlpnz7ekW3XBxhWKnbqi=w1200';

    const samplePhotos = ids.slice(0, 50).map((id) => `https://lh3.googleusercontent.com/pw/${id}=w1200`);

    return {
      title,
      coverUrl,
      photoCount: ids.length > 0 ? ids.length : 1,
      samplePhotos,
    };
  } catch (error) {
    console.error('Error parsing Google Photos album:', error);
    return {
      title: 'RVR U13 Matchday Photos',
      coverUrl: 'https://lh3.googleusercontent.com/pw/AP1GczPWQ1M0XQgCUyIxlzreFY0fQb_nHjes_A9PzrSEb627QCquRNp3-SqtttEnegipFIpyJ7HRcseV183wWPfctXvnb-2_a42Hvlpnz7ekW3XBxhWKnbqi=w1200',
      photoCount: 1,
      samplePhotos: [],
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
        await db.insert(photoAlbums).values({
          id: item.id,
          title: item.title,
          shareUrl: item.shareUrl,
          coverUrl: item.coverUrl,
          photoCount: item.photoCount,
          albumDate: item.albumDate,
          photographer: item.photographer,
          matchOpponent: item.matchOpponent,
          createdAt: item.createdAt,
        }).onConflictDoNothing();
      }
      return INITIAL_PHOTO_ALBUMS;
    }

    return rows.map((r) => ({
      ...r,
      samplePhotos: [r.coverUrl],
    })) as PhotoAlbum[];
  } catch (err) {
    console.error('Error fetching photo albums from DB, returning defaults:', err);
    return INITIAL_PHOTO_ALBUMS;
  }
}
