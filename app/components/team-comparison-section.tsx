'use client';

import { Swords, TrendingUp, Target } from 'lucide-react';
import { MatchRecord } from '../lib/matches-data';
import {
  RVR_TEAM_NAME,
  getRecentForm,
  getCommonOpponentComparison,
  getMatchupVerdict,
  TeamResult,
} from '../lib/team-comparison';

interface TeamComparisonSectionProps {
  allDivisionMatches: MatchRecord[];
  upcomingOpponents: string[];
}

function FormPills({ form }: { form: TeamResult[] }) {
  if (form.length === 0) {
    return <span className="scout-no-data">No completed matches yet</span>;
  }
  return (
    <div className="form-pills-wrap" style={{ justifyContent: 'flex-start' }}>
      {form.map((f, i) => (
        <span
          key={i}
          className={`form-dot form-${f.result.toLowerCase()}`}
          title={`${f.result} ${f.scoreFor}-${f.scoreAgainst} vs ${f.opponent} (${f.date})`}
        >
          {f.result}
        </span>
      ))}
    </div>
  );
}

function ResultBadge({ r }: { r: TeamResult }) {
  return (
    <span className={`scout-result scout-result-${r.result.toLowerCase()}`}>
      {r.result} {r.scoreFor}-{r.scoreAgainst}
    </span>
  );
}

export function TeamComparisonSection({
  allDivisionMatches,
  upcomingOpponents,
}: TeamComparisonSectionProps) {
  const rvrForm = getRecentForm(allDivisionMatches, RVR_TEAM_NAME);

  if (upcomingOpponents.length === 0) {
    return (
      <div className="scout-empty-card">
        No upcoming fixtures to scout right now.
      </div>
    );
  }

  return (
    <div className="scout-report-list">
      {upcomingOpponents.map((opponent) => {
        const opponentForm = getRecentForm(allDivisionMatches, opponent);
        const common = getCommonOpponentComparison(allDivisionMatches, RVR_TEAM_NAME, opponent);
        const verdict = getMatchupVerdict(allDivisionMatches, RVR_TEAM_NAME, opponent);
        const verdictLabel =
          verdict.favoured === 'teamA'
            ? 'RVR favoured'
            : verdict.favoured === 'teamB'
              ? `${opponent} favoured`
              : 'Too close to call';

        return (
          <div key={opponent} className="scout-card">
            <div className="scout-card-head">
              <Swords size={16} />
              <h3>River Valley Rangers FC vs {opponent}</h3>
            </div>

            <div className={`scout-verdict scout-verdict-${verdict.favoured}`}>
              <div className="scout-verdict-label">
                <Target size={14} />
                <strong>{verdictLabel}</strong>
              </div>
              <ul className="scout-verdict-reasons">
                {verdict.reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
              <p className="scout-verdict-caveat">
                A simple form-and-record heuristic, not a statistical model - the reasoning above is the whole method, nothing hidden.
              </p>
            </div>

            <div className="scout-form-row">
              <div className="scout-form-col">
                <span className="scout-form-label">RVR form</span>
                <FormPills form={rvrForm} />
              </div>
              <div className="scout-form-col">
                <span className="scout-form-label">{opponent} form</span>
                <FormPills form={opponentForm} />
              </div>
            </div>

            <div className="scout-common-section">
              <div className="scout-common-head">
                <TrendingUp size={14} />
                <span>Common opponents — the record the verdict above is partly based on</span>
              </div>

              {common.length === 0 ? (
                <p className="scout-no-data">
                  No common opponents played yet by both sides — nothing to compare against.
                </p>
              ) : (
                <div className="table-responsive">
                  <table className="scout-common-table">
                    <thead>
                      <tr>
                        <th>Common opponent</th>
                        <th>RVR result</th>
                        <th>{opponent} result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {common.map((row) => (
                        <tr key={row.opponent}>
                          <td>{row.opponent}</td>
                          <td><ResultBadge r={row.teamAResult} /></td>
                          <td><ResultBadge r={row.teamBResult} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
