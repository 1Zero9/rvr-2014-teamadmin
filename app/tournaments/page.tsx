import Link from 'next/link';
import { ArrowLeft, Medal, Trophy } from 'lucide-react';
import { PublicFooter } from '../components/public-footer';
import { PublicHeader } from '../components/public-header';
import { TournamentsSection } from '../components/tournaments-section';
import { getCurrentMember } from '../lib/authz';

export const dynamic = 'force-dynamic';

export default async function TournamentsPage() {
  const currentMember = await getCurrentMember();

  return (
    <div className="public-page-root">
      <PublicHeader isAuthenticated={Boolean(currentMember)} />

      <div className="page-hero-banner">
        <div className="section-container">
          <div className="breadcrumb">
            <Link href="/"><ArrowLeft size={14} /> Back to Hub</Link>
            <span>/</span>
            <span>Cups & Tournaments</span>
          </div>
          <span className="section-pill">
            <Trophy size={14} /> CUPS & TOURNAMENTS
          </span>
          <h1>DDSL Cup Central & Tournament Hub</h1>
          <p>
            Knockout cup formats, extra time rules, penalty shootout protocols, regional blitzes, and squad travel preparation.
          </p>
        </div>
      </div>

      <TournamentsSection />
      <PublicFooter />
    </div>
  );
}
