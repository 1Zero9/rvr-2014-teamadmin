import Link from 'next/link';
import { ArrowLeft, Calendar, ShieldCheck } from 'lucide-react';
import { PublicFooter } from '../components/public-footer';
import { PublicHeader } from '../components/public-header';
import { TrainingSection } from '../components/training-section';
import { getCurrentMember } from '../lib/authz';

export const dynamic = 'force-dynamic';

export default async function TrainingPage() {
  const currentMember = await getCurrentMember();

  return (
    <div className="public-page-root">
      <PublicHeader isAuthenticated={Boolean(currentMember)} />

      <div className="page-hero-banner">
        <div className="section-container">
          <div className="breadcrumb">
            <Link href="/"><ArrowLeft size={14} /> Back to Hub</Link>
            <span>/</span>
            <span>Training & Kit</span>
          </div>
          <span className="section-pill">
            <Calendar size={14} /> SQUAD SESSIONS & GEAR
          </span>
          <h1>Training Information & Match Preparation</h1>
          <p>
            Standard session schedule, pitch allocations, weather notifications, and mandatory kit checklist for 2014 players.
          </p>
        </div>
      </div>

      <TrainingSection />
      <PublicFooter />
    </div>
  );
}
