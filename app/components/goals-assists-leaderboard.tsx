'use client';

import { useState } from 'react';

type Row = { playerName: string; goals: number; assists: number };
type MotmRow = { playerName: string; awards: number };
type CardRow = { playerName: string; yellow: number; red: number };
type Tab = 'goals' | 'assists' | 'motm' | 'cards';

const PALETTE = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#4a3aa7', '#e34948'];

const HEADINGS: Record<Tab, { eyebrow: string; title: string }> = {
  goals: { eyebrow: 'SEASON TOTALS', title: 'Goals & assists' },
  assists: { eyebrow: 'SEASON TOTALS', title: 'Goals & assists' },
  motm: { eyebrow: 'PLAYER OF THE MATCH', title: 'Matchday awards' },
  cards: { eyebrow: 'DISCIPLINE', title: 'Yellow & red cards' },
};

export function GoalsAssistsLeaderboard({ leaderboard, motmLeaders, cardLeaders }: { leaderboard: Row[]; motmLeaders: MotmRow[]; cardLeaders: CardRow[] }) {
  const [tab, setTab] = useState<Tab>('goals');
  const metric = tab === 'assists' ? 'assists' : 'goals';
  const other = metric === 'goals' ? 'assists' : 'goals';
  const sorted = [...leaderboard].sort((a, b) => b[metric] - a[metric] || b[other] - a[other] || a.playerName.localeCompare(b.playerName));
  const max = Math.max(...sorted.map((row) => row[metric]), 1);
  const heading = HEADINGS[tab];

  return (
    <article className="panel">
      <div className="leaderboard-heading">
        <div><span>{heading.eyebrow}</span><h3>{heading.title}</h3></div>
        <div className="leaderboard-toggle" role="tablist">
          <button type="button" role="tab" aria-selected={tab === 'goals'} className={tab === 'goals' ? 'active' : ''} onClick={() => setTab('goals')}>Goals</button>
          <button type="button" role="tab" aria-selected={tab === 'assists'} className={tab === 'assists' ? 'active' : ''} onClick={() => setTab('assists')}>Assists</button>
          <button type="button" role="tab" aria-selected={tab === 'motm'} className={tab === 'motm' ? 'active' : ''} onClick={() => setTab('motm')}>MOTM</button>
          <button type="button" role="tab" aria-selected={tab === 'cards'} className={tab === 'cards' ? 'active' : ''} onClick={() => setTab('cards')}>Cards</button>
        </div>
      </div>
      {tab === 'cards' ? (
        cardLeaders.length === 0 ? <p className="match-stats-help">No cards recorded. Lucky!</p> : (
          <div className="cards-list">{cardLeaders.map((row) => <div key={row.playerName}><strong>{row.playerName}</strong><span><b><i className="card-tile card-tile-yellow" />{row.yellow}</b><b><i className="card-tile card-tile-red" />{row.red}</b></span></div>)}</div>
        )
      ) : tab === 'motm' ? (
        motmLeaders.length === 0 ? <p className="match-stats-help">Player of the match awards will appear after your first record.</p> : (
          <div className="motm-list">{motmLeaders.map((row) => <div key={row.playerName}><strong>{row.playerName}</strong><span>{row.awards} {row.awards === 1 ? 'award' : 'awards'}</span></div>)}</div>
        )
      ) : (
        sorted.length === 0 ? <p className="match-stats-help">Record the first match to start the running table.</p> : (
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
        )
      )}
    </article>
  );
}
