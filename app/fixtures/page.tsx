import Link from 'next/link';
import { ArrowLeft, BarChart3, ExternalLink, RefreshCw, Trophy } from 'lucide-react';
import { FixturesSection } from '../components/fixtures-section';
import { PublicFooter } from '../components/public-footer';
import { PublicHeader } from '../components/public-header';
import { canManageAccounts, requireApprovedMember } from '../lib/authz';
import { fetchLiveDdslLeagueData } from '../lib/ddsl-live';

export const dynamic = 'force-dynamic';

// The whole workspace uses one shared-password session.
export default async function FixturesPage() {
  const currentMember = await requireApprovedMember();
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
            Official match schedule and live division standings for River Valley Rangers FC. DDSL scorelines may be capped; the private tracker keeps the squad&apos;s real score and player contributions.
          </p>
          <Link href="/stats" className="secondary" style={{ display: 'inline-flex', marginTop: 16, alignItems: 'center', gap: 7 }}>
            <BarChart3 size={16} /> Open private player tracker
          </Link>
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
        canSync={Boolean(currentMember && canManageAccounts(currentMember.role))}
      />
      <PublicFooter />
    </div>
  );
}
