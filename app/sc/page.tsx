import Link from 'next/link';
import { ArrowLeft, Zap } from 'lucide-react';
import { PublicFooter } from '../components/public-footer';
import { PublicHeader } from '../components/public-header';
import { SCSection } from '../components/sc-section';
import { requireApprovedMember } from '../lib/authz';

export const dynamic = 'force-dynamic';

export default async function SCPage() {
  const currentMember = await requireApprovedMember();

  return (
    <div className="public-page-root">
      <PublicHeader isAuthenticated={Boolean(currentMember)} />

      <div className="page-hero-banner">
        <div className="section-container">
          <div className="breadcrumb">
            <Link href="/portal"><ArrowLeft size={14} /> Back to Portal</Link>
            <span>/</span>
            <span>Strength & Conditioning</span>
          </div>
          <span className="section-pill">
            <Zap size={14} /> RVR U13 MAJOR 1 · SPEED & AGILITY
          </span>
          <h1>Speed, Agility & Athletic Conditioning</h1>
          <p>
            Dynamic FIFA 11+ activation, rapid footwork speed ladders, and core stability drills calibrated for our U13 athletes.
          </p>
        </div>
      </div>

      <SCSection />
      <PublicFooter />
    </div>
  );
}
