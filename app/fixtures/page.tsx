import Link from 'next/link';
import { ArrowLeft, ExternalLink, RefreshCw, Trophy } from 'lucide-react';
import { FixturesSection } from '../components/fixtures-section';
import { PublicFooter } from '../components/public-footer';
import { PublicHeader } from '../components/public-header';
import { getCurrentMember } from '../lib/authz';
import { fetchLiveDdslLeagueData } from '../lib/ddsl-live';

export const dynamic = 'force-dynamic';

export default async function FixturesPage() {
  const currentMember = await getCurrentMember();
  const liveDdslData = await fetchLiveDdslLeagueData('218148');

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
            <Trophy size={14} /> DDSL OFFICIAL LEAGUE FEED · ID: 218148
          </span>
          <h1>{liveDdslData.leagueName}</h1>
          <p>
            Official match schedule, verified full-time results, goalscorers, upcoming kick-offs, and live division standings for River Valley Rangers FC.
          </p>
        </div>
      </div>

      <FixturesSection
        initialMatches={liveDdslData.rvrMatches}
        allDivisionMatches={liveDdslData.allDivisionMatches}
        liveStandings={liveDdslData.standings}
        leagueName={liveDdslData.leagueName}
        leagueUrl={liveDdslData.leagueUrl}
      />
      <PublicFooter />
    </div>
  );
}
