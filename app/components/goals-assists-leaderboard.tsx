'use client';

import { useState } from 'react';

type Row = { playerName: string; goals: number; assists: number };
type Metric = 'goals' | 'assists';

const PALETTE = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#4a3aa7', '#e34948'];

export function GoalsAssistsLeaderboard({ leaderboard }: { leaderboard: Row[] }) {
  const [metric, setMetric] = useState<Metric>('goals');
  const other: Metric = metric === 'goals' ? 'assists' : 'goals';
  const sorted = [...leaderboard].sort((a, b) => b[metric] - a[metric] || b[other] - a[other] || a.playerName.localeCompare(b.playerName));
  const max = Math.max(...sorted.map((row) => row[metric]), 1);

  return (
    <article className="panel">
      <div className="leaderboard-heading">
        <div><span>SEASON TOTALS</span><h3>Goals & assists</h3></div>
        <div className="leaderboard-toggle" role="tablist">
          <button type="button" role="tab" aria-selected={metric === 'goals'} className={metric === 'goals' ? 'active' : ''} onClick={() => setMetric('goals')}>Goals</button>
          <button type="button" role="tab" aria-selected={metric === 'assists'} className={metric === 'assists' ? 'active' : ''} onClick={() => setMetric('assists')}>Assists</button>
        </div>
      </div>
      {sorted.length === 0 ? <p className="match-stats-help">Record the first match to start the running table.</p> : (
        <div className="leaderboard-rows">
          {sorted.map((row, index) => {
            const value = row[metric];
            const pct = Math.max((value / max) * 100, value > 0 ? 8 : 0);
            const color = PALETTE[index % PALETTE.length];
            const secondaryLabel = metric === 'goals' ? `${row.assists} ast` : `${row.goals} gls`;
            return (
              <div className="leaderboard-row" key={row.playerName}>
                <span className="leaderboard-rank">{index + 1}</span>
                <div className="leaderboard-main">
                  <span className="leaderboard-name">{row.playerName}</span>
                  <div className="leaderboard-track"><div className="leaderboard-fill" style={{ width: `${pct}%`, background: color }} /></div>
                </div>
                <div className="leaderboard-value">
                  <strong>{value}</strong>
                  <span>{secondaryLabel}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </article>
  );
}
