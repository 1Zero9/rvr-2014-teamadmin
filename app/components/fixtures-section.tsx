'use client';

import { useEffect, useState } from 'react';
import {
  Calendar,
  ExternalLink,
  MapPin,
  RefreshCw,
  RotateCw,
} from 'lucide-react';
import { LeagueStanding, MatchRecord } from '../lib/matches-data';
import { TeamComparisonSection } from './team-comparison-section';

interface FixturesSectionProps {
  initialMatches: MatchRecord[];
  allDivisionMatches?: MatchRecord[];
  liveStandings?: LeagueStanding[];
  leagueName?: string;
  leagueUrl?: string;
  isLive?: boolean;
  /** Manual DDSL sync writes to the database, so only a Super Admin sees it. */
  canSync?: boolean;
}

export function FixturesSection({
  initialMatches,
  allDivisionMatches = [],
  liveStandings = [],
  leagueName = '13 Major 1 Boys Sat',
  leagueUrl = 'https://ddsl.ie/league/218148/',
  isLive = true,
  canSync = false,
}: FixturesSectionProps) {
  // The league table is the actual point of this page - land on it, not on
  // "All Matches".
  const [filter, setFilter] = useState<'all' | 'results' | 'fixtures' | 'table' | 'scout' | 'ddsl-portal'>('table');
  const [scope, setScope] = useState<'rvr' | 'division'>('rvr');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [feedLive, setFeedLive] = useState(isLive);

  useEffect(() => {
    const openRequestedView = () => {
      const view = new URLSearchParams(window.location.search).get('view');
      // Keep old shared links working, while new links use a durable query
      // parameter instead of a hash that is easy to lose during navigation.
      if (view === 'scout' || window.location.hash === '#scout') setFilter('scout');
    };
    openRequestedView();
    window.addEventListener('hashchange', openRequestedView);
    window.addEventListener('popstate', openRequestedView);
    return () => {
      window.removeEventListener('hashchange', openRequestedView);
      window.removeEventListener('popstate', openRequestedView);
    };
  }, []);

  const activeMatchesList = scope === 'rvr' ? initialMatches : (allDivisionMatches.length > 0 ? allDivisionMatches : initialMatches);
  const completedMatches = activeMatchesList.filter((m) => m.status === 'completed');
  const upcomingMatches = activeMatchesList.filter((m) => m.status === 'upcoming');

  // Always RVR's own upcoming opponents for the scout report, regardless of
  // the all-division/RVR-only scope toggle above - scouting an opponent
  // only makes sense for a fixture RVR is actually playing.
  const rvrUpcomingOpponents = [
    ...new Set(initialMatches.filter((m) => m.status === 'upcoming').map((m) => m.opponent)),
  ];

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncStatus('Refreshing…');
    try {
      const res = await fetch('/api/ddsl/sync');
      const data = await res.json();
      if (data.success) {
        setFeedLive(true);
        setSyncStatus('Up to date');
        setTimeout(() => setSyncStatus(null), 4000);
      } else {
        setFeedLive(false);
        setSyncStatus('Couldn’t refresh');
        setTimeout(() => setSyncStatus(null), 3000);
      }
    } catch {
      setFeedLive(false);
      setSyncStatus('Couldn’t refresh');
      setTimeout(() => setSyncStatus(null), 3000);
    } finally {
      setIsSyncing(false);
    }
  };

  const displayedMatches = activeMatchesList.filter((m) => {
    if (filter === 'results' && m.status !== 'completed') return false;
    if (filter === 'fixtures' && m.status !== 'upcoming') return false;
    return true;
  });

  return (
    <section className="public-section" id="fixtures-hub">
      <div className="section-container">
        <div className="fixtures-toolbar">
          <div className={`feed-status ${feedLive ? 'live' : 'offline'}`}>
            <span className="live-dot" />
            <span>DDSL {feedLive ? 'live' : 'unavailable'}</span>
          </div>

          <div className="sync-actions">
            {syncStatus && <span className="sync-msg">{syncStatus}</span>}
            {canSync && (
              <button
                type="button"
                className="sync-btn"
                onClick={handleSync}
                disabled={isSyncing}
              >
                <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
                <span>{isSyncing ? 'Refreshing…' : 'Refresh'}</span>
              </button>
            )}
            <a
              href={leagueUrl}
              target="_blank"
              rel="noreferrer"
              className="sync-ext-btn"
            >
              <span>Open DDSL</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Filter Navigation Tabs & Scope Toggle */}
        <div className="fixtures-filter-row">
          <div className="filter-bar">
            <button
              type="button"
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              type="button"
              className={`filter-tab ${filter === 'results' ? 'active' : ''}`}
              onClick={() => setFilter('results')}
            >
              Results
            </button>
            <button
              type="button"
              className={`filter-tab ${filter === 'fixtures' ? 'active' : ''}`}
              onClick={() => setFilter('fixtures')}
            >
              Fixtures
            </button>
            <button
              type="button"
              className={`filter-tab ${filter === 'table' ? 'active' : ''}`}
              onClick={() => setFilter('table')}
            >
              Table
            </button>
            <button
              type="button"
              className={`filter-tab ${filter === 'scout' ? 'active' : ''}`}
              onClick={() => setFilter('scout')}
            >
              Scout
            </button>
          </div>

          {filter !== 'table' && filter !== 'scout' && filter !== 'ddsl-portal' && (
            <div className="scope-toggle-group">
              <button
                type="button"
                className={`scope-btn ${scope === 'rvr' ? 'active' : ''}`}
                onClick={() => setScope('rvr')}
              >
                Our matches
              </button>
              <button
                type="button"
                className={`scope-btn ${scope === 'division' ? 'active' : ''}`}
                onClick={() => setScope('division')}
              >
                Division
              </button>
            </div>
          )}
        </div>

        {/* Scout Report View */}
        {filter === 'scout' ? (
          <TeamComparisonSection
            allDivisionMatches={allDivisionMatches.length > 0 ? allDivisionMatches : initialMatches}
            upcomingOpponents={rvrUpcomingOpponents}
          />
        ) : filter === 'table' ? (
          <div className="league-table-card">
            <div className="table-card-head">
              <div>
                <span className="table-badge">OFFICIAL DDSL STANDINGS</span>
                <h3>{leagueName}</h3>
              </div>
              <a
                href={leagueUrl}
                target="_blank"
                rel="noreferrer"
                className="ddsl-ext-link"
              >
                <span>Verify on DDSL.ie</span>
                <ExternalLink size={12} />
              </a>
            </div>

            <div className="rotate-hint">
              <RotateCw size={22} />
              <strong>Rotate your phone</strong>
              <span>The full league table needs landscape to read cleanly.</span>
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
                  {liveStandings.map((row) => (
                    <tr
                      key={row.team}
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

          </div>
        ) : (
          /* Fixtures & Results Grid */
          <div className="matches-grid">
            {displayedMatches.map((match) => {
              const isCompleted = match.status === 'completed';

              let homeTeamName = match.homeTeam;
              let awayTeamName = match.awayTeam;
              let homeScoreVal = match.homeScore;
              let awayScoreVal = match.awayScore;

              if (!homeTeamName || !awayTeamName) {
                if (match.homeAway === 'home') {
                  homeTeamName = 'River Valley Rangers FC';
                  awayTeamName = match.opponent;
                  homeScoreVal = match.rvrGoals;
                  awayScoreVal = match.opponentGoals;
                } else if (match.homeAway === 'away') {
                  homeTeamName = match.opponent;
                  awayTeamName = 'River Valley Rangers FC';
                  homeScoreVal = match.opponentGoals;
                  awayScoreVal = match.rvrGoals;
                } else {
                  const parts = match.opponent.split(' vs ');
                  homeTeamName = parts[0] || match.opponent;
                  awayTeamName = parts[1] || 'Opponent';
                  homeScoreVal = match.rvrGoals;
                  awayScoreVal = match.opponentGoals;
                }
              }

              const isHomeRvr = homeTeamName.toLowerCase().includes('river valley') || homeTeamName.toLowerCase().includes('rivervalley');
              const isAwayRvr = awayTeamName.toLowerCase().includes('river valley') || awayTeamName.toLowerCase().includes('rivervalley');
              const isDirectRvr = isHomeRvr || isAwayRvr;

              const isWin = isCompleted && isDirectRvr && (
                isHomeRvr
                  ? (homeScoreVal ?? 0) > (awayScoreVal ?? 0)
                  : (awayScoreVal ?? 0) > (homeScoreVal ?? 0)
              );
              const isDraw = isCompleted && isDirectRvr && (homeScoreVal ?? 0) === (awayScoreVal ?? 0);
              const isLoss = isCompleted && isDirectRvr && !isWin && !isDraw;

              return (
                <article
                  key={match.id}
                  className={`match-card ${isCompleted ? 'is-result' : 'is-fixture'}`}
                >
                  <div className="match-card-top">
                    <span className="match-comp-pill">
                      {match.competition}
                    </span>
                    <span className={`match-status-badge ${isCompleted ? (isDirectRvr ? (isWin ? 'win' : isDraw ? 'draw' : 'loss') : 'completed') : 'upcoming'}`}>
                      {isCompleted ? (isDirectRvr ? (isWin ? 'WON' : isDraw ? 'DRAW' : 'LOST') : 'FT') : 'UPCOMING'}
                    </span>
                  </div>

                  {/* Teams & Score Strip */}
                  <div className="match-teams-box">
                    <div className={`match-team-row ${isHomeRvr ? 'is-rvr' : ''}`}>
                      <span className="team-role-tag">HOME</span>
                      <strong className="team-name">{homeTeamName}</strong>
                      {isCompleted && homeScoreVal !== null && homeScoreVal !== undefined && (
                        <span className="team-score-box">{homeScoreVal}</span>
                      )}
                    </div>

                    <div className={`match-team-row ${isAwayRvr ? 'is-rvr' : ''}`}>
                      <span className="team-role-tag">AWAY</span>
                      <strong className="team-name">{awayTeamName}</strong>
                      {isCompleted && awayScoreVal !== null && awayScoreVal !== undefined && (
                        <span className="team-score-box">{awayScoreVal}</span>
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

                  {/* Notes / Referee */}
                  {match.matchNotes && (
                    <p className="match-notes-text">
                      &ldquo;{match.matchNotes}&rdquo;
                    </p>
                  )}

                  {/* Action Link */}
                  <div className="match-card-footer">
                    <span className="ddsl-id-tag">{match.ddslMatchId || 'DDSL-218148'}</span>
                    <span className="match-venue-link">
                      <MapPin size={12} />
                      <span>{match.venue}</span>
                    </span>
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
