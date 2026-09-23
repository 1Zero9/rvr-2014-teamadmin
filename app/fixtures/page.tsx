import { FixturesSection } from '../components/fixtures-section';
import { PortalPage } from '../components/portal-page';
import { canManageAccounts, requireApprovedMember } from '../lib/authz';
import { fetchLiveDdslLeagueData } from '../lib/ddsl-live';

export const dynamic = 'force-dynamic';

export default async function FixturesPage() {
  const member = await requireApprovedMember();
  const live = await fetchLiveDdslLeagueData('218148');
  return <PortalPage member={member} active="/fixtures" eyebrow="DDSL LEAGUE DESK" title={live.leagueName || 'Fixtures, form & scouting'}>
    {live.error && <div className="notice"><span>Couldn&apos;t load live DDSL data right now. Refresh shortly; no estimated results are shown.</span></div>}
    <FixturesSection initialMatches={live.rvrMatches} allDivisionMatches={live.allDivisionMatches} liveStandings={live.standings} leagueName={live.leagueName} leagueUrl={live.leagueUrl} canSync={canManageAccounts(member.role)} />
  </PortalPage>;
}
