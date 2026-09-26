'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, Pencil } from 'lucide-react';
import { MatchEditForm } from './match-edit-form';

type Goal = { minute: number | null; scorerName: string; assistName: string | null; team: 'rvr' | 'opponent' };

function outcome(rvrGoals: number, opponentGoals: number) {
  if (rvrGoals > opponentGoals) return { code: 'W', label: 'Win' } as const;
  if (rvrGoals < opponentGoals) return { code: 'L', label: 'Loss' } as const;
  return { code: 'D', label: 'Draw' } as const;
}

export function MatchDetailCard({
  matchId,
  label,
  date,
  opponentName,
  rvrGoals,
  opponentGoals,
  playerOfMatch,
  notes,
  goals,
}: {
  matchId: string;
  label: string;
  date: string;
  opponentName: string;
  rvrGoals: number;
  opponentGoals: number;
  playerOfMatch: string | null;
  notes: string | null;
  goals: Goal[];
}) {
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const result = outcome(rvrGoals, opponentGoals);

  return (
    <div className="result-card">
      <div className="result-card-head">
        <span className={`result-badge result-badge-${result.code.toLowerCase()}`} title={result.label}>{result.code}</span>
        <span className="result-date">{date || label}</span>
      </div>

      <div className="result-teams">
        <div className="result-team">
          <Image src="/rvr-crest.png" width={28} height={28} alt="" className="team-avatar" />
          <span className="team-name rvr-team-name">RVR</span>
          <span className="team-score">{rvrGoals}</span>
        </div>
        <div className="result-team">
          <span className="team-avatar team-avatar-initial" aria-hidden>{opponentName.charAt(0)}</span>
          <span className="team-name">{opponentName}</span>
          <span className="team-score">{opponentGoals}</span>
        </div>
      </div>

      <div className="result-card-actions">
        <button type="button" className="text-button" onClick={() => setExpanded((current) => !current)}>
          <ChevronDown size={14} className={expanded ? 'chevron-open' : undefined} /> {expanded ? 'Hide details' : 'Details'}
        </button>
        <button type="button" className="text-button" onClick={() => { setEditing((current) => !current); setExpanded(true); }}>
          <Pencil size={13} /> {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {expanded && (editing ? (
        <MatchEditForm matchId={matchId} rvrGoals={rvrGoals} opponentGoals={opponentGoals} playerOfMatch={playerOfMatch} notes={notes} goals={goals} />
      ) : (
        <div className="result-card-details">
          {playerOfMatch && <p className="match-stats-help"><strong>Player of the match:</strong> {playerOfMatch}</p>}
          <ul className="match-detail-goals">
            {goals.length === 0 && <li className="match-stats-help">No goal events recorded.</li>}
            {goals.map((goal, index) => (
              <li key={index} className={goal.team === 'opponent' ? 'opponent-goal' : undefined}>
                {goal.team === 'opponent'
                  ? `${opponentName} goal${goal.minute ? ` · ${goal.minute}′` : ''}`
                  : `${goal.minute ? `${goal.minute}′ ` : ''}${goal.scorerName}${goal.assistName ? ` (${goal.assistName})` : ''}`}
              </li>
            ))}
          </ul>
          {notes && <p className="match-stats-help">{notes}</p>}
        </div>
      ))}
    </div>
  );
}
