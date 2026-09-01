import Link from 'next/link';
import { ArrowLeft, Calendar } from 'lucide-react';
import { PublicFooter } from '../components/public-footer';
import { PublicHeader } from '../components/public-header';
import { TrainingSection } from '../components/training-section';
import { requireApprovedMember } from '../lib/authz';

export const dynamic = 'force-dynamic';

export default async function TrainingPage() {
  const currentMember = await requireApprovedMember();

  return (
    <div className="public-page-root">
      <PublicHeader isAuthenticated={Boolean(currentMember)} />

      <div className="page-hero-banner">
        <div className="section-container">
          <div className="breadcrumb">
            <Link href="/portal"><ArrowLeft size={14} /> Back to Portal</Link>
            <span>/</span>
            <span>Training & Kit</span>
          </div>
          <span className="section-pill">
            <Calendar size={14} /> RVR U13 MAJOR 1 · SESSIONS & GEAR
          </span>
          <h1>Training Schedule & Matchday Readiness</h1>
          <p>
            Weekly pitch slots, arrival times, weather alerts, and the essential matchday gear checklist for RVR U13 Major 1.
          </p>
        </div>
      </div>

      <TrainingSection />
      <PublicFooter />
    </div>
  );
}
