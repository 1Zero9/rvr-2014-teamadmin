import { desc } from 'drizzle-orm';
import { ExternalLink, Plus } from 'lucide-react';
import { getDb } from '../../db';
import { photoAlbums } from '../../db/schema';
import { addGooglePhotosAlbumAction } from '../actions';
import { PortalPage } from '../components/portal-page';
import { requireApprovedMember } from '../lib/authz';

export const dynamic = 'force-dynamic';

export default async function AlbumsPage() {
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
    <section className="album-card-grid">
      {albums.map((album) => <a key={album.id} href={album.shareUrl} target="_blank" rel="noreferrer" className="album-link-card">
        <img src={album.coverUrl} alt="" />
        <div><span>GOOGLE PHOTOS</span><h3>{album.title}</h3><p>Open album <ExternalLink size={14} /></p></div>
      </a>)}
      {!albums.length && <p className="match-stats-help">No albums saved yet. Add your first Google Photos link above.</p>}
    </section>
  </PortalPage>;
}
