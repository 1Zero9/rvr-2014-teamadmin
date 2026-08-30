import Link from 'next/link';
import { ArrowLeft, Camera, Sparkles } from 'lucide-react';
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
          <div className="breadcrumb">
            <Link href="/"><ArrowLeft size={14} /> Back to Hub</Link>
            <span>/</span>
            <span>Google Photos Gallery</span>
          </div>
          <span className="section-pill">
            <Camera size={14} /> RVR U13 MAJOR 1 · SQUAD MOMENTS
          </span>
          <h1>Matchday Action & Squad Memories</h1>
          <p>
            Official Google Photos shared albums captured by our team photographer. Browse HD photos right here or open in Google Photos for full high-resolution downloads.
          </p>
        </div>
      </div>

      <GallerySection initialAlbums={albums} />
      <PublicFooter />
    </div>
  );
}
