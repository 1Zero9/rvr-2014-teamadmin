'use client';

import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { MatchEditForm } from './match-edit-form';

export function MatchDetailCard({
  matchId,
  label,
  rvrGoals,
  opponentGoals,
  playerOfMatch,
  notes,
  goals,
}: {
  matchId: string;
  label: string;
  rvrGoals: number;
  opponentGoals: number;
  playerOfMatch: string | null;
  notes: string | null;
  goals: { minute: number | null; scorerName: string; assistName: string | null; team: 'rvr' | 'opponent' }[];
}) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="match-detail-card">
      <div className="match-detail-header">
        <div>
          <h4>{label}</h4>
          <strong>RVR {rvrGoals} – {opponentGoals} opponent</strong>
        </div>
        <button type="button" className="text-button" onClick={() => setEditing((current) => !current)}>
          <Pencil size={13} /> {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {editing ? (
        <MatchEditForm matchId={matchId} rvrGoals={rvrGoals} opponentGoals={opponentGoals} playerOfMatch={playerOfMatch} notes={notes} goals={goals} />
      ) : (
        <>
          {playerOfMatch && <p className="match-stats-help"><strong>Player of the match:</strong> {playerOfMatch}</p>}
          <ul className="match-detail-goals">
            {goals.length === 0 && <li className="match-stats-help">No goal events recorded.</li>}
            {goals.map((goal, index) => (
              <li key={index} className={goal.team === 'opponent' ? 'opponent-goal' : undefined}>
                {goal.team === 'opponent'
                  ? `Opponent goal${goal.minute ? ` · ${goal.minute}′` : ''}`
                  : `${goal.minute ? `${goal.minute}′ ` : ''}${goal.scorerName}${goal.assistName ? ` (${goal.assistName})` : ''}`}
              </li>
            ))}
          </ul>
          {notes && <p className="match-stats-help">{notes}</p>}
        </>
      )}
    </div>
  );
}
