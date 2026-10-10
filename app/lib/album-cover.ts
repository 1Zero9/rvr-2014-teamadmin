// Google Photos share pages expose the album cover as an og:image meta tag.
export const PLACEHOLDER_COVER = '/hero-squad.jpg';

export async function fetchAlbumCover(shareUrl: string): Promise<string | null> {
  try {
    const res = await fetch(shareUrl, { headers: { 'User-Agent': 'Mozilla/5.0' }, redirect: 'follow', signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const html = await res.text();
    const match = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i);
    if (!match) return null;
    const src = match[1].replace(/&amp;/g, '&').replace(/=w\d+-h\d+.*$/, '=w800');
    return src.startsWith('https://') ? src : null;
  } catch { return null; }
}
