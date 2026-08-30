import { desc } from 'drizzle-orm';
import { Lightbulb } from 'lucide-react';
import { getDb } from '../../db';
import { ideas } from '../../db/schema';
import { addIdea } from '../actions';
import { AccessPending, PortalPage } from '../components/portal-page';
import { requireApprovedMember } from '../lib/authz';

export const dynamic = 'force-dynamic';

export default async function IdeasPage() {
  const member = await requireApprovedMember();
  if (!member.approved) return <AccessPending member={member} />;

  let rows: typeof ideas.$inferSelect[] = [];
  try {
    rows = await getDb().select().from(ideas).orderBy(desc(ideas.createdAt));
  } catch (err) {
    console.error('Error loading ideas:', err);
  }

  return (
    <PortalPage
      member={member}
      active="/ideas"
      eyebrow="FOR THE LADS"
      title="Activity ideas"
    >
      <div className="page-grid">
        <article className="panel">
          {rows.length === 0 ? (
            <div className="empty-state">
              <Lightbulb />
              <strong>No ideas proposed yet</strong>
              <p>Start a shortlist for outings, fundraisers and end-of-year activities.</p>
            </div>
          ) : (
            <div className="idea-list">
              {rows.map((r) => (
                <div className="idea-card" key={r.id}>
                  <span className="badge">{r.status}</span>
                  <h3>{r.title}</h3>
                  <p>{r.details || 'No further details.'}</p>
                  <div className="idea-meta">
                    <span>Proposed by {r.proposedBy}</span>
                    <strong>{r.votes} votes</strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
        <form className="form-card" action={addIdea}>
          <h2>Propose an idea</h2>
          <p>Give parents and coaches a useful starting point.</p>
          <div className="field-grid">
            <div className="field full">
              <label>Idea</label>
              <input
                name="title"
                placeholder="e.g. End-of-season stadium tour"
                required
              />
            </div>
            <div className="field full">
              <label>Details</label>
              <textarea
                name="details"
                placeholder="Estimated cost, date options or anything helpful"
              />
            </div>
          </div>
          <button className="primary">Add idea</button>
        </form>
      </div>
    </PortalPage>
  );
}
