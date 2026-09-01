import Link from 'next/link';
import { Camera } from 'lucide-react';
import { GallerySection } from '../components/gallery-section';
import { PublicFooter } from '../components/public-footer';
import { PublicHeader } from '../components/public-header';
import { getCurrentMember } from '../lib/authz';
import { getPhotoAlbumsFromDb } from '../lib/photos-server';

export const dynamic = 'force-dynamic';

export default async function PhotosPage() {
  const currentMember = await getCurrentMember();
  const albums = await getPhotoAlbumsFromDb();

  return (
    <div className="public-page-root">
      <PublicHeader isAuthenticated={Boolean(currentMember)} />

      <div className="page-hero-banner">
        <div className="section-container">
          <span className="section-pill">
            <Camera size={14} /> RIVERVALLEY RANGERS AFC · U13 MAJOR 1 (2014 SQUAD)
          </span>
          <h1>Matchday Action & Squad Gallery</h1>
          <p>
            Official matchday action shots, tournament blitzes, and squad memories captured by our team photographer. Browse HD albums directly or open in Google Photos for full high-resolution downloads.
          </p>
        </div>
      </div>

      <GallerySection initialAlbums={albums} />
      <PublicFooter />
    </div>
  );
}
