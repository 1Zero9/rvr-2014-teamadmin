import Link from 'next/link';
import { ArrowLeft, ExternalLink, RefreshCw, Trophy } from 'lucide-react';
import { FixturesSection } from '../components/fixtures-section';
import { PublicFooter } from '../components/public-footer';
import { PublicHeader } from '../components/public-header';
import { getCurrentMember } from '../lib/authz';
import { fetchLiveDdslLeagueData } from '../lib/ddsl-live';

export const dynamic = 'force-dynamic';

// Genuinely public, like /photos - match results and league standings for a
// kids' team aren't sensitive the way /fund, /expenses and /contributions
// are. This used to hard-redirect anyone not logged in to /login despite
// using the same PublicHeader/PublicFooter/public-page-root styling as
// /photos, which never did - an inconsistency, not a real access decision.
export default async function FixturesPage() {
  const currentMember = await getCurrentMember();
  const liveDdslData = await fetchLiveDdslLeagueData('218148');

  return (
    <div className="public-page-root">
      <PublicHeader isAuthenticated={Boolean(currentMember)} />

      <div className="page-hero-banner">
        <div className="section-container">
          <div className="breadcrumb">
            {currentMember && (
              <>
                <Link href="/portal"><ArrowLeft size={14} /> Back to Portal</Link>
                <span>/</span>
              </>
            )}
            <span>Fixtures & Results</span>
          </div>
          <span className="section-pill">
            <Trophy size={14} /> DDSL OFFICIAL LEAGUE FEED · ID: 218148
          </span>
          <h1>{liveDdslData.leagueName || 'Fixtures & Results'}</h1>
          <p>
            Official match schedule, verified full-time results, goalscorers, upcoming kick-offs, and live division standings for River Valley Rangers FC.
          </p>
        </div>
      </div>

      {liveDdslData.error && (
        <div className="section-container" style={{ margin: '16px auto' }}>
          <div
            style={{
              background: '#fff4f4',
              border: '1px solid #f3b7b7',
              borderRadius: 8,
              padding: '14px 18px',
              color: '#8a2020',
              fontSize: 14,
            }}
          >
            Couldn&apos;t load live DDSL data right now, so nothing below is
            shown rather than guessing. Try refreshing shortly.
          </div>
        </div>
      )}

      <FixturesSection
        initialMatches={liveDdslData.rvrMatches}
        allDivisionMatches={liveDdslData.allDivisionMatches}
        liveStandings={liveDdslData.standings}
        leagueName={liveDdslData.leagueName}
        leagueUrl={liveDdslData.leagueUrl}
        isAuthenticated={Boolean(currentMember)}
      />
      <PublicFooter />
    </div>
  );
}
