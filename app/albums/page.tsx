import { desc } from 'drizzle-orm';
import { ExternalLink, Pencil, Plus } from 'lucide-react';
import { getDb } from '../../db';
import { photoAlbums } from '../../db/schema';
import { addGooglePhotosAlbumAction, updateGooglePhotosAlbumAction } from '../actions';
import { PortalPage } from '../components/portal-page';
import { requireApprovedMember } from '../lib/authz';

export const dynamic = 'force-dynamic';

export default async function AlbumsPage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const { saved, error } = await searchParams;
  const member = await requireApprovedMember();
  let albums: typeof photoAlbums.$inferSelect[] = [];
  try { albums = await getDb().select().from(photoAlbums).orderBy(desc(photoAlbums.createdAt)); } catch (error) { console.error('Unable to load albums:', error); }
  return <PortalPage member={member} active="/albums" eyebrow="ALBUMS" title="Photos">
    <div className="match-stats-layout">
      <article className="panel">
        <div className="section-heading"><div><span>ADD</span><h3>Google Photos link</h3></div><Plus size={20} /></div>
        <form action={addGooglePhotosAlbumAction} className="match-stats-form">
          <label>Album title<input name="title" required maxLength={120} placeholder="e.g. Castlenock away · Sept 2026" /></label>
          <label>Google Photos share link<input name="shareUrl" type="url" required placeholder="https://photos.app.goo.gl/..." /></label>
          <button className="primary" type="submit"><Plus size={16} /> Add album</button>
        </form>
      </article>
    </div>
    {error && <p className="match-stats-help" role="alert" style={{ color: '#b91c1c' }}>✗ {error}</p>}
    {saved && <p className="match-stats-help" role="status">✓ Album saved.</p>}
    <section className="album-card-grid">
      {albums.map((album) => <div key={album.id} className="album-link-card">
        <a href={album.shareUrl} target="_blank" rel="noreferrer">
          <div className="album-cover"><img src={album.coverUrl} alt="" referrerPolicy="no-referrer" loading="lazy" /></div>
          <div><span>GOOGLE PHOTOS</span><h3>{album.title}</h3><p>Open album <ExternalLink size={14} /></p></div>
        </a>
        <details className="album-edit">
          <summary><Pencil size={13} /> Edit</summary>
          <form action={updateGooglePhotosAlbumAction} className="match-stats-form">
            <input type="hidden" name="id" value={album.id} />
            <label>Album title<input name="title" required maxLength={120} defaultValue={album.title} /></label>
            <label>Google Photos share link<input name="shareUrl" type="url" required defaultValue={album.shareUrl} /></label>
            <label>Cover image address<input name="coverUrl" defaultValue={album.coverUrl} placeholder="Leave empty to use Google's cover" /></label>
            <p className="match-stats-help">To pick a different cover: open the album, right-click the photo you want, choose “Copy image address”, and paste it here.</p>
            <button className="primary" type="submit">Save</button>
          </form>
        </details>
      </div>)}
      {!albums.length && <p className="match-stats-help">No albums saved yet. Add your first Google Photos link above.</p>}
    </section>
  </PortalPage>;
}
