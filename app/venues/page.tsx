import Link from 'next/link';
import { ArrowLeft, Compass } from 'lucide-react';
import { PublicFooter } from '../components/public-footer';
import { PublicHeader } from '../components/public-header';
import { VenuesSection } from '../components/venues-section';
import { requireApprovedMember } from '../lib/authz';

export const dynamic = 'force-dynamic';

export default async function VenuesPage() {
  const currentMember = await requireApprovedMember();

  return (
    <div className="public-page-root">
      <PublicHeader isAuthenticated={Boolean(currentMember)} />

      <div className="page-hero-banner">
        <div className="section-container">
          <div className="breadcrumb">
            <Link href="/portal"><ArrowLeft size={14} /> Back to Portal</Link>
            <span>/</span>
            <span>Pitch Venues</span>
          </div>
          <span className="section-pill">
            <Compass size={14} /> RVR U13 MAJOR 1 · PITCH LOCATIONS
          </span>
          <h1>Pitch Venues & Matchday Navigation</h1>
          <p>
            One-tap Google & Apple Maps navigation, pitch surfaces, footwear advice, and parking guides for our home and away fixtures.
          </p>
        </div>
      </div>

      <VenuesSection />
      <PublicFooter />
    </div>
  );
}
