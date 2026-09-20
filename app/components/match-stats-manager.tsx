'use client';

import { useState } from 'react';
import { Minus, Plus, Save } from 'lucide-react';
import { saveMatchPerformanceAction } from '../actions';

type MatchOption = { id: string; label: string };

export function MatchStatsManager({ matches }: { matches: MatchOption[] }) {
  const [rows, setRows] = useState([{ key: 1 }]);

  return (
    <article className="panel match-stats-editor">
      <div className="section-heading">
        <div>
          <span>PRIVATE MATCH RECORD</span>
          <h3>Add or replace a match&apos;s player contributions</h3>
        </div>
      </div>
      <p className="match-stats-help">
        Enter the real score from Pytch, even where DDSL publishes a capped result. Saving a match again replaces its contribution rows, so corrections stay clean.
      </p>
      {matches.length === 0 ? (
        <p className="match-stats-help">No DDSL fixtures are available yet. Sync or refresh the Fixtures page, then return here to record the match.</p>
      ) : (
        <form action={saveMatchPerformanceAction} className="match-stats-form">
          <label>
            Match
            <select name="matchId" required defaultValue="">
              <option value="" disabled>Choose a fixture or result</option>
              {matches.map((match) => <option key={match.id} value={match.id}>{match.label}</option>)}
            </select>
          </label>
          <div className="match-stats-score-row">
            <label>
              Real RVR score
              <input name="rvrGoals" type="number" min="0" inputMode="numeric" required />
            </label>
            <span>–</span>
            <label>
              Opponent score
              <input name="opponentGoals" type="number" min="0" inputMode="numeric" required />
            </label>
            <label className="potm-input">
              Player of the match
              <input name="playerOfMatch" placeholder="Player name" />
            </label>
          </div>

          <div className="contribution-heading">
            <strong>Scorers & assists</strong>
            <span>Leave unused rows blank</span>
          </div>
          <div className="contribution-rows">
            {rows.map((row, index) => (
              <div className="contribution-row" key={row.key}>
                <input name="playerName" placeholder={`Player ${index + 1}`} />
                <input name="playerGoals" type="number" min="0" inputMode="numeric" defaultValue="0" aria-label="Goals" />
                <input name="playerAssists" type="number" min="0" inputMode="numeric" defaultValue="0" aria-label="Assists" />
                <button
                  type="button"
                  className="icon-button"
                  aria-label="Remove player row"
                  disabled={rows.length === 1}
                  onClick={() => setRows((all) => all.filter((item) => item.key !== row.key))}
                ><Minus size={15} /></button>
              </div>
            ))}
          </div>
          <button type="button" className="text-button" onClick={() => setRows((all) => [...all, { key: Date.now() }])}>
            <Plus size={15} /> Add player
          </button>
          <label>
            Private notes (optional)
            <textarea name="notes" rows={3} placeholder="Anything worth keeping with this result" />
          </label>
          <button className="primary" type="submit"><Save size={16} /> Save private match record</button>
        </form>
      )}
    </article>
  );
}
