import Link from 'next/link';
import { ArrowLeft, Camera, Sparkles } from 'lucide-react';
import { GallerySection } from '../components/gallery-section';
import { PublicFooter } from '../components/public-footer';
import { PublicHeader } from '../components/public-header';
import { getCurrentMember } from '../lib/authz';

export const dynamic = 'force-dynamic';

export default async function PhotosPage() {
  const currentMember = await getCurrentMember();

  return (
    <div className="public-page-root">
      <PublicHeader isAuthenticated={Boolean(currentMember)} />

      <div className="page-hero-banner">
        <div className="section-container">
          <div className="breadcrumb">
            <Link href="/"><ArrowLeft size={14} /> Back to Hub</Link>
            <span>/</span>
            <span>Photos & Highlights</span>
          </div>
          <span className="section-pill">
            <Camera size={14} /> RVR U13 MAJOR 1 · SQUAD MOMENTS
          </span>
          <h1>Matchday Action & Squad Memories</h1>
          <p>
            Action snapshots, goal celebrations, tournament victories, and squad camaraderie for our U13 Major 1 boys.
          </p>
        </div>
      </div>

      <GallerySection />
      <PublicFooter />
    </div>
  );
}
