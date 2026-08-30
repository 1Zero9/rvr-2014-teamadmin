import { desc } from 'drizzle-orm';
import { ArrowDownLeft } from 'lucide-react';
import { getDb } from '../../db';
import { transactions } from '../../db/schema';
import { recordTransaction } from '../actions';
import { AccessPending, PortalPage } from '../components/portal-page';
import { canManageAccounts, requireApprovedMember } from '../lib/authz';

export const dynamic = 'force-dynamic';

export default async function ContributionsPage() {
  const member = await requireApprovedMember();
  if (!member.approved) return <AccessPending member={member} />;

  let rows: typeof transactions.$inferSelect[] = [];
  try {
    rows = (
      await getDb()
        .select()
        .from(transactions)
        .orderBy(desc(transactions.occurredOn))
    ).filter((r) => r.type === 'income');
  } catch (err) {
    console.error('Error fetching contributions:', err);
  }

  return (
    <PortalPage
      member={member}
      active="/contributions"
      eyebrow="MONEY IN"
      title="Parent contributions"
    >
      <div className="page-grid">
        <article className="panel">
          {rows.length === 0 ? (
            <div className="empty-state">
              <ArrowDownLeft />
              <strong>No contributions recorded</strong>
              <p>Record the first family payment to begin the season ledger.</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Contribution</th>
                  <th>Date & method</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>
                      {member.role === 'parent' ? 'Family contribution' : r.personName}
                      <small>{r.description}</small>
                    </td>
                    <td>
                      {r.occurredOn}
                      <small>
                        {member.role === 'parent'
                          ? 'Payment recorded'
                          : r.paymentMethod || 'Not recorded'}
                      </small>
                    </td>
                    <td className="money-in">
                      +€{(r.amountCents / 100).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </article>
        {canManageAccounts(member.role) && (
          <form className="form-card" action={recordTransaction}>
            <input type="hidden" name="type" value="income" />
            <h2>Record contribution</h2>
            <p>Keep the payer and payment route attached to every entry.</p>
            <div className="field-grid">
              <div className="field full">
                <label>Parent / family</label>
                <input name="personName" required />
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
                <label>Date received</label>
                <input name="occurredOn" type="date" required />
              </div>
              <div className="field full">
                <label>Payment method</label>
                <select name="paymentMethod">
                  <option>Bank transfer</option>
                  <option>Revolut</option>
                  <option>Cash</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="field full">
                <label>Note</label>
                <input
                  name="description"
                  defaultValue="Season fund contribution"
                  required
                />
              </div>
            </div>
            <button className="primary">Save contribution</button>
          </form>
        )}
      </div>
    </PortalPage>
  );
}
