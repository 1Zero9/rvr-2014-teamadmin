import Link from 'next/link';
import { ArrowLeft, Dumbbell, Zap } from 'lucide-react';
import { PublicFooter } from '../components/public-footer';
import { PublicHeader } from '../components/public-header';
import { SCSection } from '../components/sc-section';
import { getCurrentMember } from '../lib/authz';

export const dynamic = 'force-dynamic';

export default async function SCPage() {
  const currentMember = await getCurrentMember();

  return (
    <div className="public-page-root">
      <PublicHeader isAuthenticated={Boolean(currentMember)} />

      <div className="page-hero-banner">
        <div className="section-container">
          <div className="breadcrumb">
            <Link href="/"><ArrowLeft size={14} /> Back to Hub</Link>
            <span>/</span>
            <span>Strength & Conditioning</span>
          </div>
          <span className="section-pill">
            <Zap size={14} /> YOUTH S & C PROGRAM
          </span>
          <h1>Strength, Speed & Athletic Conditioning</h1>
          <p>
            Evidence-based youth athletic protocols focusing on speed mechanics, agility ladders, core strength, and injury prevention.
          </p>
        </div>
      </div>

      <SCSection />
      <PublicFooter />
    </div>
  );
}
