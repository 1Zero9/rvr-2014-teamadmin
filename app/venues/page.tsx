import Link from 'next/link';
import { ArrowLeft, Compass, MapPin } from 'lucide-react';
import { PublicFooter } from '../components/public-footer';
import { PublicHeader } from '../components/public-header';
import { VenuesSection } from '../components/venues-section';
import { getCurrentMember } from '../lib/authz';

export const dynamic = 'force-dynamic';

export default async function VenuesPage() {
  const currentMember = await getCurrentMember();

  return (
    <div className="public-page-root">
      <PublicHeader isAuthenticated={Boolean(currentMember)} />

      <div className="page-hero-banner">
        <div className="section-container">
          <div className="breadcrumb">
            <Link href="/"><ArrowLeft size={14} /> Back to Hub</Link>
            <span>/</span>
            <span>Pitch Venues</span>
          </div>
          <span className="section-pill">
            <Compass size={14} /> PITCH LOCATIONS & GPS
          </span>
          <h1>Match Locations & Pitch Directory</h1>
          <p>
            One-tap GPS directions, pitch surfaces, footwear recommendations, and parking tips for home and away fixtures.
          </p>
        </div>
      </div>

      <VenuesSection />
      <PublicFooter />
    </div>
  );
}
