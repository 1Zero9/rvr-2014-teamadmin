import { MapPin, ShieldCheck, Trophy, Users } from 'lucide-react';
import { AccessPending, PortalPage } from '../components/portal-page';
import { requireApprovedMember } from '../lib/authz';

export const dynamic = 'force-dynamic';

export default async function InformationPage() {
  const member = await requireApprovedMember();
  if (!member.approved) return <AccessPending member={member} />;

  return (
    <PortalPage
      member={member}
      active="/information"
      eyebrow="USEFUL LINKS"
      title="Team information"
    >
      <div className="info-cards">
        <article className="info-card">
          <MapPin />
          <h2>Pitch locations</h2>
          <p>
            Directions, parking notes and facilities for Rivervalley Park,
            Brookdale, Rathingle and Ridgewood.
          </p>
          <a
            href="https://www.rivervalleyrangers.ie/pitch-locations"
            target="_blank"
            rel="noreferrer"
          >
            Open club pitch guide ↗
          </a>
        </article>
        <article className="info-card">
          <Trophy />
          <h2>DDSL</h2>
          <p>
            Official league fixtures, results, tables and competition
            information.
          </p>
          <a href="https://ddsl.ie/" target="_blank" rel="noreferrer">
            Open DDSL ↗
          </a>
        </article>
        <article className="info-card">
          <Users />
          <h2>RVR club website</h2>
          <p>
            Club news, registration, contact routes and wider Rivervalley
            Rangers information.
          </p>
          <a
            href="https://www.rivervalleyrangers.ie/"
            target="_blank"
            rel="noreferrer"
          >
            Visit the club site ↗
          </a>
        </article>
        <article className="info-card">
          <ShieldCheck />
          <h2>Safeguarding</h2>
          <p>
            Club safeguarding policies, welfare guidance and approved contact
            routes.
          </p>
          <a
            href="https://www.rivervalleyrangers.ie/safeguarding"
            target="_blank"
            rel="noreferrer"
          >
            Open safeguarding hub ↗
          </a>
        </article>
      </div>
    </PortalPage>
  );
}
