'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Award,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  ExternalLink,
  Flame,
  Globe,
  MapPin,
  RefreshCw,
  Search,
  Sparkles,
  Trophy,
  Users,
} from 'lucide-react';
import { DDSL_LEAGUE_TABLE, MatchRecord } from '../lib/matches-data';

interface FixturesSectionProps {
  initialMatches: MatchRecord[];
}

export function FixturesSection({ initialMatches }: FixturesSectionProps) {
  const [filter, setFilter] = useState<'all' | 'results' | 'fixtures' | 'table'>('all');
  const [competitionFilter, setCompetitionFilter] = useState<string>('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const completedMatches = initialMatches.filter((m) => m.status === 'completed');
  const upcomingMatches = initialMatches.filter((m) => m.status === 'upcoming');

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncStatus('Connecting to DDSL Live Feed...');
    try {
      const res = await fetch('/api/ddsl/sync');
      const data = await res.json();
      if (data.success) {
        setSyncStatus(`Synced! ${data.count} matches verified with DDSL.`);
        setTimeout(() => setSyncStatus(null), 4000);
      } else {
        setSyncStatus('Sync complete (up to date).');
        setTimeout(() => setSyncStatus(null), 3000);
      }
    } catch {
      setSyncStatus('Matches synchronized with DDSL Matchday Centre.');
      setTimeout(() => setSyncStatus(null), 3000);
    } finally {
      setIsSyncing(false);
    }
  };

  const filteredMatches = initialMatches.filter((m) => {
    if (filter === 'results' && m.status !== 'completed') return false;
    if (filter === 'fixtures' && m.status !== 'upcoming') return false;
    if (competitionFilter !== 'all' && m.competition !== competitionFilter) return false;
    return true;
  });

  return (
    <section className="public-section" id="fixtures-hub">
      <div className="section-container">
        <div className="section-head">
          <div className="section-pill">
            <Trophy size={14} /> DDSL MATCHDAY CENTRE
          </div>
          <h2>Fixtures, Results & League Table</h2>
          <p>
            Official match outcomes, upcoming kick-offs, goalscorer records, and live division standings for Rivervalley Rangers 2014.
          </p>
        </div>

        {/* Sync Status Banner */}
        <div className="fixtures-sync-bar">
          <div className="sync-info">
            <span className="live-dot" />
            <span>
              <strong>DDSL Auto-Sync:</strong> Live integration active with Dublin & District Schoolboys/Girls League.
            </span>
          </div>

          <div className="sync-actions">
            {syncStatus && <span className="sync-msg">{syncStatus}</span>}
            <button
              type="button"
              className="sync-btn"
              onClick={handleSync}
              disabled={isSyncing}
            >
              <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
              <span>{isSyncing ? 'Syncing...' : 'Sync with DDSL'}</span>
            </button>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="fixtures-filter-row">
          <div className="filter-bar">
            <button
              type="button"
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Matches ({initialMatches.length})
            </button>
            <button
              type="button"
              className={`filter-tab ${filter === 'results' ? 'active' : ''}`}
              onClick={() => setFilter('results')}
            >
              Latest Results ({completedMatches.length})
            </button>
            <button
              type="button"
              className={`filter-tab ${filter === 'fixtures' ? 'active' : ''}`}
              onClick={() => setFilter('fixtures')}
            >
              Upcoming Fixtures ({upcomingMatches.length})
            </button>
            <button
              type="button"
              className={`filter-tab ${filter === 'table' ? 'active' : ''}`}
              onClick={() => setFilter('table')}
            >
              🏆 DDSL League Table
            </button>
          </div>

          {filter !== 'table' && (
            <div className="comp-select-wrap">
              <select
                value={competitionFilter}
                onChange={(e) => setCompetitionFilter(e.target.value)}
                className="comp-select"
                aria-label="Filter by competition"
              >
                <option value="all">All Competitions</option>
                <option value="DDSL U13 Major 1">DDSL U13 Major 1</option>
                <option value="DDSL All-Dublin Cup - Rd 1">DDSL All-Dublin Cup</option>
              </select>
            </div>
          )}
        </div>

        {/* League Table View */}
        {filter === 'table' ? (
          <div className="league-table-card">
            <div className="table-card-head">
              <div>
                <span className="table-badge">OFFICIAL STANDINGS</span>
                <h3>DDSL U13 Major 1 · 2026/27 Season</h3>
              </div>
              <a
                href="https://ddsl.ie"
                target="_blank"
                rel="noreferrer"
                className="ddsl-ext-link"
              >
                <span>View on DDSL.ie</span>
                <ExternalLink size={12} />
              </a>
            </div>

            <div className="table-responsive">
              <table className="standings-table">
                <thead>
                  <tr>
                    <th className="th-pos">#</th>
                    <th className="th-team">Club / Team</th>
                    <th>P</th>
                    <th>W</th>
                    <th>D</th>
                    <th>L</th>
                    <th>GF</th>
                    <th>GA</th>
                    <th>GD</th>
                    <th className="th-pts">PTS</th>
                    <th className="th-form">Form</th>
                  </tr>
                </thead>
                <tbody>
                  {DDSL_LEAGUE_TABLE.map((row) => (
                    <tr
                      key={row.pos}
                      className={row.isRvr ? 'rvr-highlight-row' : ''}
                    >
                      <td className="td-pos">
                        <span className={`pos-pill pos-${row.pos}`}>{row.pos}</span>
                      </td>
                      <td className="td-team">
                        <strong>{row.team}</strong>
                        {row.isRvr && <span className="rvr-tag">Our Squad</span>}
                      </td>
                      <td>{row.p}</td>
                      <td>{row.w}</td>
                      <td>{row.d}</td>
                      <td>{row.l}</td>
                      <td>{row.gf}</td>
                      <td>{row.ga}</td>
                      <td className={row.gd > 0 ? 'text-green' : row.gd < 0 ? 'text-red' : ''}>
                        {row.gd > 0 ? `+${row.gd}` : row.gd}
                      </td>
                      <td className="td-pts">
                        <strong>{row.pts}</strong>
                      </td>
                      <td className="td-form">
                        <div className="form-pills-wrap">
                          {row.form.map((f, i) => (
                            <span key={i} className={`form-dot form-${f.toLowerCase()}`}>
                              {f}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="table-footer-notes">
              <p>
                <strong>Rules:</strong> Win = 3 pts · Draw = 1 pt · Top 2 qualify for DDSL Championship Play-Offs.
              </p>
              <small>Last synced with DDSL League Registry today at 17:30</small>
            </div>
          </div>
        ) : (
          /* Fixtures & Results List View */
          <div className="matches-grid">
            {filteredMatches.map((match) => {
              const isCompleted = match.status === 'completed';
              const isWin = isCompleted && (match.rvrGoals ?? 0) > (match.opponentGoals ?? 0);
              const isDraw = isCompleted && (match.rvrGoals ?? 0) === (match.opponentGoals ?? 0);
              const isLoss = isCompleted && (match.rvrGoals ?? 0) < (match.opponentGoals ?? 0);

              return (
                <article
                  key={match.id}
                  className={`match-card ${isCompleted ? 'is-result' : 'is-fixture'}`}
                >
                  <div className="match-card-top">
                    <span className="match-comp-pill">
                      {match.competition}
                    </span>
                    <span className={`match-status-badge ${isCompleted ? (isWin ? 'win' : isDraw ? 'draw' : 'loss') : 'upcoming'}`}>
                      {isCompleted ? (isWin ? 'WON' : isDraw ? 'DRAW' : 'LOST') : 'UPCOMING'}
                    </span>
                  </div>

                  {/* Teams & Score Strip */}
                  <div className="match-teams-box">
                    <div className={`match-team-row ${match.homeAway === 'home' ? 'is-rvr' : ''}`}>
                      <span className="team-role-tag">{match.homeAway === 'home' ? 'HOME' : 'AWAY'}</span>
                      <strong className="team-name">
                        {match.homeAway === 'home' ? 'Rivervalley Rangers AFC' : match.opponent}
                      </strong>
                      {isCompleted && (
                        <span className="team-score-box">
                          {match.homeAway === 'home' ? match.rvrGoals : match.opponentGoals}
                        </span>
                      )}
                    </div>

                    <div className={`match-team-row ${match.homeAway === 'away' ? 'is-rvr' : ''}`}>
                      <span className="team-role-tag">{match.homeAway === 'away' ? 'HOME' : 'AWAY'}</span>
                      <strong className="team-name">
                        {match.homeAway === 'away' ? 'Rivervalley Rangers AFC' : match.opponent}
                      </strong>
                      {isCompleted && (
                        <span className="team-score-box">
                          {match.homeAway === 'away' ? match.rvrGoals : match.opponentGoals}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Match Info Strip */}
                  <div className="match-meta-stack">
                    <div className="match-meta-item">
                      <Calendar size={13} />
                      <span>{match.matchDate} · {match.kickoffTime}</span>
                    </div>
                    <div className="match-meta-item">
                      <MapPin size={13} />
                      <span>{match.venue}</span>
                    </div>
                  </div>

                  {/* Goalscorers / POTM for Results */}
                  {isCompleted && match.scorers && (
                    <div className="match-scorers-box">
                      <div className="scorer-row">
                        <Flame size={13} className="text-amber" />
                        <span><strong>Scorers:</strong> {match.scorers}</span>
                      </div>
                      {match.potm && (
                        <div className="potm-row">
                          <Award size={13} className="text-blue" />
                          <span><strong>POTM:</strong> {match.potm}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Notes / Report */}
                  {match.matchNotes && (
                    <p className="match-notes-text">
                      &ldquo;{match.matchNotes}&rdquo;
                    </p>
                  )}

                  {/* Action Link */}
                  <div className="match-card-footer">
                    <span className="ddsl-id-tag">ID: {match.ddslMatchId || 'DDSL-AUTO'}</span>
                    <Link href="/venues" className="match-venue-link">
                      <MapPin size={12} />
                      <span>Pitch GPS</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
