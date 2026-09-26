'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { updateMatchPerformanceAction } from '../actions';

type GoalRow = { minute: string; scorerName: string; assistName: string; team: 'rvr' | 'opponent' };

export function MatchEditForm({
  matchId,
  rvrGoals,
  opponentGoals,
  playerOfMatch,
  notes,
  goals,
}: {
  matchId: string;
  rvrGoals: number;
  opponentGoals: number;
  playerOfMatch: string | null;
  notes: string | null;
  goals: { minute: number | null; scorerName: string; assistName: string | null; team: 'rvr' | 'opponent' }[];
}) {
  const [rows, setRows] = useState<GoalRow[]>(
    goals.length
      ? goals.map((goal) => ({ minute: goal.minute?.toString() ?? '', scorerName: goal.scorerName, assistName: goal.assistName ?? '', team: goal.team }))
      : [{ minute: '', scorerName: '', assistName: '', team: 'rvr' }],
  );

  function updateRow(index: number, patch: Partial<GoalRow>) {
    setRows((current) => current.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  return (
    <form action={updateMatchPerformanceAction} className="match-stats-form">
      <input type="hidden" name="matchId" value={matchId} />
      <div className="match-stats-score-row">
        <label>RVR goals<input type="number" name="rvrGoals" min={0} defaultValue={rvrGoals} required /></label>
        <span>–</span>
        <label>Opponent goals<input type="number" name="opponentGoals" min={0} defaultValue={opponentGoals} required /></label>
        <label className="potm-input">Player of the match<input type="text" name="playerOfMatch" defaultValue={playerOfMatch ?? ''} /></label>
      </div>
      <label>Notes<textarea name="notes" rows={2} defaultValue={notes ?? ''} /></label>

      <div className="contribution-heading">
        <strong>Goals</strong>
        <span>Tag each goal RVR or opponent so only real RVR contributions count toward season stats.</span>
      </div>
      <div className="contribution-rows">
        {rows.map((row, index) => (
          <div className="contribution-row goal-edit-row" key={index}>
            <input type="text" name="goalScorer" placeholder="Scorer" value={row.scorerName} onChange={(event) => updateRow(index, { scorerName: event.target.value })} />
            <input type="text" name="goalAssist" placeholder="Assist" value={row.assistName} onChange={(event) => updateRow(index, { assistName: event.target.value })} />
            <input type="number" name="goalMinute" placeholder="Min" min={0} value={row.minute} onChange={(event) => updateRow(index, { minute: event.target.value })} />
            <select name="goalTeam" value={row.team} onChange={(event) => updateRow(index, { team: event.target.value as GoalRow['team'] })}>
              <option value="rvr">RVR</option>
              <option value="opponent">Opponent</option>
            </select>
            <button type="button" className="icon-button" disabled={rows.length === 1} onClick={() => setRows((current) => current.filter((_, i) => i !== index))} aria-label="Remove goal">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
      <button type="button" className="text-button" onClick={() => setRows((current) => [...current, { minute: '', scorerName: '', assistName: '', team: 'rvr' }])}>
        <Plus size={14} /> Add goal
      </button>

      <button className="primary" type="submit">Save changes</button>
    </form>
  );
}
