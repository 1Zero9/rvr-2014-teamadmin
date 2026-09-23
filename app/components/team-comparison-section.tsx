'use client';

import { useState } from 'react';
import { Swords, Target, TrendingUp } from 'lucide-react';
import { MatchRecord } from '../lib/matches-data';
import { RVR_TEAM_NAME, getCommonOpponentComparison, getMatchupVerdict, getRecentForm, resultsForTeam, type TeamResult } from '../lib/team-comparison';

interface TeamComparisonSectionProps { allDivisionMatches: MatchRecord[]; upcomingOpponents: string[]; }

function FormPills({ form }: { form: TeamResult[] }) {
  return form.length ? <div className="form-pills-wrap" style={{ justifyContent: 'flex-start' }}>{form.map((item, index) => <span key={`${item.date}-${index}`} className={`form-dot form-${item.result.toLowerCase()}`} title={`${item.result} ${item.scoreFor}-${item.scoreAgainst} vs ${item.opponent}`}>{item.result}</span>)}</div> : <span className="scout-no-data">No completed matches yet</span>;
}

function ResultBadge({ result }: { result: TeamResult }) { return <span className={`scout-result scout-result-${result.result.toLowerCase()}`}>{result.result} {result.scoreFor}-{result.scoreAgainst}</span>; }

export function TeamComparisonSection({ allDivisionMatches, upcomingOpponents }: TeamComparisonSectionProps) {
  const teams = [...new Set(allDivisionMatches.flatMap((match) => [match.homeTeam, match.awayTeam]).filter(Boolean) as string[])].sort((a, b) => a.localeCompare(b));
  const [team, setTeam] = useState(upcomingOpponents[0] || teams.find((item) => item !== RVR_TEAM_NAME) || '');
  const form = getRecentForm(allDivisionMatches, team);
  const results = resultsForTeam(allDivisionMatches, team).slice().reverse();
  const common = getCommonOpponentComparison(allDivisionMatches, RVR_TEAM_NAME, team);
  const verdict = getMatchupVerdict(allDivisionMatches, RVR_TEAM_NAME, team);
  const isRvr = team === RVR_TEAM_NAME;

  return <div className="scout-report-list">
    <article className="scout-card">
      <div className="scout-card-head"><Swords size={16} /><h3>Team explorer</h3></div>
      <label className="team-explorer-select">Team<select value={team} onChange={(event) => setTeam(event.target.value)}>{teams.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
      <div className="scout-form-row"><div className="scout-form-col"><span className="scout-form-label">Recent form</span><FormPills form={form} /></div><div className="scout-form-col"><span className="scout-form-label">Completed matches</span><strong>{results.length}</strong></div></div>
      <div className="scout-common-section"><div className="scout-common-head"><TrendingUp size={14} /><span>Every completed match</span></div>{results.length ? <div className="table-responsive"><table className="scout-common-table"><thead><tr><th>Date</th><th>Opponent</th><th>Venue</th><th>Result</th></tr></thead><tbody>{results.map((result, index) => <tr key={`${result.date}-${result.opponent}-${index}`}><td>{result.date}</td><td>{result.opponent}</td><td>{result.venue}</td><td><ResultBadge result={result} /></td></tr>)}</tbody></table></div> : <p className="scout-no-data">No completed matches recorded for this team yet.</p>}</div>
    </article>
    {!isRvr && <article className="scout-card">
      <div className="scout-card-head"><Target size={16} /><h3>RVR comparison vs {team}</h3></div>
      <div className={`scout-verdict scout-verdict-${verdict.favoured}`}><div className="scout-verdict-label"><Target size={14} /><strong>{verdict.favoured === 'teamA' ? 'RVR favoured' : verdict.favoured === 'teamB' ? `${team} favoured` : 'Too close to call'}</strong></div><ul className="scout-verdict-reasons">{verdict.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul><p className="scout-verdict-caveat">A transparent form and shared-opponent heuristic, not a predicted score.</p></div>
      <div className="scout-common-section"><div className="scout-common-head"><TrendingUp size={14} /><span>Shared opponents</span></div>{common.length ? <div className="table-responsive"><table className="scout-common-table"><thead><tr><th>Opponent</th><th>RVR</th><th>{team}</th></tr></thead><tbody>{common.map((row) => <tr key={row.opponent}><td>{row.opponent}</td><td><ResultBadge result={row.teamAResult} /></td><td><ResultBadge result={row.teamBResult} /></td></tr>)}</tbody></table></div> : <p className="scout-no-data">No shared opponents played yet.</p>}</div>
    </article>}
  </div>;
}
