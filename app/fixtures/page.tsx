import Link from 'next/link';
import { ArrowLeft, RefreshCw, Trophy } from 'lucide-react';
import { FixturesSection } from '../components/fixtures-section';
import { PublicFooter } from '../components/public-footer';
import { PublicHeader } from '../components/public-header';
import { getCurrentMember } from '../lib/authz';
import { getMatchesFromDb } from '../lib/matches';

export const dynamic = 'force-dynamic';

export default async function FixturesPage() {
  const currentMember = await getCurrentMember();
  const initialMatches = await getMatchesFromDb();

  return (
    <div className="public-page-root">
      <PublicHeader isAuthenticated={Boolean(currentMember)} />

      <div className="page-hero-banner">
        <div className="section-container">
          <div className="breadcrumb">
            <Link href="/"><ArrowLeft size={14} /> Back to Hub</Link>
            <span>/</span>
            <span>Fixtures & Results</span>
          </div>
          <span className="section-pill">
            <Trophy size={14} /> DDSL MATCHDAY CENTRE
          </span>
          <h1>DDSL Fixtures, Latest Results & Standings</h1>
          <p>
            Real-time match outcomes, goalscorers, upcoming kick-offs, pitch allocations, and official league table for RVR 2014.
          </p>
        </div>
      </div>

      <FixturesSection initialMatches={initialMatches} />
      <PublicFooter />
    </div>
  );
}
