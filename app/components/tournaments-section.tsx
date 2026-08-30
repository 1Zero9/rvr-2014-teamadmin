'use client';

import { useState } from 'react';
import {
  Award,
  Calendar,
  ChevronRight,
  ExternalLink,
  Flame,
  Medal,
  Shield,
  Sparkles,
  Trophy,
} from 'lucide-react';

const TOURNAMENTS = [
  {
    id: 'ddsl-cup',
    title: 'DDSL All-Dublin Cup 2026/27',
    tag: 'Official Knockout Cup',
    dates: 'Rounds 1–4 (Autumn/Winter)',
    status: 'In Progress · Round 2 Draw Pending',
    format: 'Single-elimination knockout · 70-Minute match (35 min halves)',
    rules: [
      'Level scores at full time: 10 minutes extra time each way (2 × 10 mins)',
      'If still level: FIFA standard 5-player penalty shootout, followed by sudden death',
      'Roll-on / roll-off substitutes permitted (max 5 stoppages)',
      'All players must be officially registered on FAI Comet / DDSL portal',
    ],
    highlight: 'Major season objective for the RVR 2014 squad.',
  },
  {
    id: 'swords-summer-cup',
    title: 'Swords & Fingal Invitational Blitz',
    tag: 'Regional Tournament',
    dates: 'May Bank Holiday Weekend 2027',
    status: 'Confirmed Entry',
    format: 'Group Stage (4 teams) followed by Cup & Shield Semi-Finals',
    rules: [
      '20-minute matches with 5-minute half-time intervals',
      '3 points for win, 1 point for draw, head-to-head tiebreaker',
      'Medals and trophies presented for Cup winners, runners-up, and Shield finalists',
    ],
    highlight: 'Great festival of football against local Fingal rivals.',
  },
  {
    id: 'season-tour',
    title: 'End-of-Season Away Tour (Belfast / Galway)',
    tag: 'Squad Tour & Friendly Series',
    dates: 'June 2027 (Date TBC with Parents)',
    status: 'Planning Phase · Ideas open in Team Portal',
    format: '2-Day tour featuring 3 competitive friendly fixtures and squad bonding activities',
    rules: [
      'Coach and parent supervised travel and hotel accommodation',
      'Funded in part by the RVR 2014 Team Fund and parent contributions',
      'Itinerary details and voting available inside the Private Team Portal',
    ],
    highlight: 'Unforgettable team bonding milestone for the players.',
  },
];

const PACKING_LIST = [
  'Full match kit (Blue home jersey, white away jersey, shorts, socks)',
  'Both Grass boots (molds) and 4G Astro trainers',
  '2 pairs of shin guards and compression tape',
  'RVR Official warm-up jacket and club tracksuit bottoms',
  'Refillable 1L water bottle and energy recovery snacks',
  'Towels and change of dry casual clothes for journey home',
];

export function TournamentsSection() {
  const [selectedTourney, setSelectedTourney] = useState(0);

  const current = TOURNAMENTS[selectedTourney];

  return (
    <section className="public-section alt-bg" id="tournaments">
      <div className="section-container">
        <div className="section-head">
          <div className="section-pill">
            <Trophy size={14} /> CUPS & TOURNAMENTS
          </div>
          <h2>Competition Hub & Squad Events</h2>
          <p>
            DDSL Cup match protocols, tournament schedules, blitz formats, and touring checklists for the 2014 squad.
          </p>
        </div>

        <div className="tournaments-grid">
          {/* Tournament List & Cards */}
          <div className="tournament-cards-stack">
            {TOURNAMENTS.map((t, idx) => (
              <div
                key={t.id}
                className={`tournament-card ${selectedTourney === idx ? 'selected' : ''}`}
                onClick={() => setSelectedTourney(idx)}
              >
                <div className="t-card-top">
                  <span className="t-tag">{t.tag}</span>
                  <span className="t-status">{t.status}</span>
                </div>
                <h3>{t.title}</h3>
                <div className="t-meta">
                  <span className="t-date">
                    <Calendar size={14} /> {t.dates}
                  </span>
                  <span className="t-format">
                    <Medal size={14} /> {t.format}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Rules & Checklist Sidebar */}
          <div className="tournament-detail-panel">
            <div className="detail-panel-header">
              <div className="cup-icon-wrap">
                <Trophy size={28} />
              </div>
              <div>
                <span className="cup-eyebrow">{current.tag}</span>
                <h3>{current.title}</h3>
                <small>{current.highlight}</small>
              </div>
            </div>

            <div className="detail-rules-box">
              <h4>Competition Rules & Match Regulations:</h4>
              <ul>
                {current.rules.map((rule, index) => (
                  <li key={index}>
                    <Shield size={14} /> <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="packing-checklist-box">
              <h4>Tournament Packing Checklist:</h4>
              <div className="packing-grid">
                {PACKING_LIST.map((item, i) => (
                  <div key={i} className="packing-item">
                    <Award size={13} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="ddsl-external-cta">
              <a
                href="https://ddsl.ie/"
                target="_blank"
                rel="noreferrer"
                className="ddsl-official-link"
              >
                <span>Check Official DDSL Cup Fixtures & Draws</span>
                <ExternalLink size={15} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
