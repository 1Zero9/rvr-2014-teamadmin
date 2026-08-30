import { desc } from 'drizzle-orm';
import { ReceiptText } from 'lucide-react';
import { getDb } from '../../db';
import { transactions } from '../../db/schema';
import { recordTransaction } from '../actions';
import { AccessPending, PortalPage } from '../components/portal-page';
import { requireApprovedMember } from '../lib/authz';

export const dynamic = 'force-dynamic';

export default async function ExpensesPage() {
  const member = await requireApprovedMember();
  if (!member.approved) return <AccessPending member={member} />;

  let rows: typeof transactions.$inferSelect[] = [];
  try {
    rows = (
      await getDb()
        .select()
        .from(transactions)
        .orderBy(desc(transactions.occurredOn))
    ).filter((r) => r.type === 'expense');
  } catch (err) {
    console.error('Error loading expenses:', err);
  }

  const canSubmit = member.role !== 'parent';

  return (
    <PortalPage
      member={member}
      active="/expenses"
      eyebrow="MONEY OUT"
      title="Expenses & requests"
    >
      <div className="page-grid">
        <article className="panel">
          {rows.length === 0 ? (
            <div className="empty-state">
              <ReceiptText />
              <strong>No spending recorded</strong>
              <p>Coach requests and approved purchases will appear here.</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Request / purchase</th>
                  <th>Requested by</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>
                      {r.description}
                      <small>
                        {r.category} · {r.occurredOn}
                      </small>
                    </td>
                    <td>{member.role === 'parent' ? 'Team expense' : r.personName}</td>
                    <td>
                      <span className={`badge ${r.status}`}>{r.status}</span>
                    </td>
                    <td className="money-out">
                      −€{(r.amountCents / 100).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </article>
        {canSubmit && (
          <form className="form-card" action={recordTransaction}>
            <input type="hidden" name="type" value="expense" />
            <h2>
              {member.role === 'coach'
                ? 'Request an expense'
                : 'Record an expense'}
            </h2>
            <p>
              Coach submissions remain pending until an administrator approves
              them.
            </p>
            <div className="field-grid">
              <div className="field full">
                <label>Requested by / paid to</label>
                <input
                  name="personName"
                  defaultValue={member.displayName}
                  required
                />
              </div>
              <div className="field">
                <label>Amount (€)</label>
                <input
                  name="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
              <div className="field">
                <label>Date</label>
                <input name="occurredOn" type="date" required />
              </div>
              <div className="field full">
                <label>Category</label>
                <select name="category">
                  <option>Equipment</option>
                  <option>Referee costs</option>
                  <option>Replacement kit</option>
                  <option>Team activity</option>
                  <option>Christmas outing</option>
                  <option>End-of-year event</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="field full">
                <label>Description</label>
                <textarea name="description" required />
              </div>
            </div>
            <button className="primary">
              {member.role === 'coach' ? 'Submit request' : 'Save expense'}
            </button>
          </form>
        )}
      </div>
    </PortalPage>
  );
}
