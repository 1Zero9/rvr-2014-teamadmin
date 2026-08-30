'use client';

import { useState } from 'react';
import {
  Calendar,
  CheckSquare,
  Clock,
  CloudSun,
  Flame,
  Info,
  MapPin,
  ShieldAlert,
  Sparkles,
  Square,
} from 'lucide-react';

const INITIAL_CHECKLIST = [
  { id: 'shinguards', label: 'Compulsory Shin Guards', detail: 'Must be worn under socks for every session and match', checked: true },
  { id: 'boots', label: 'Appropriate Footwear', detail: 'Molded studs for grass / Astro trainers for all-weather pitches', checked: true },
  { id: 'water', label: '750ml Labeled Water Bottle', detail: 'Hydration is mandatory throughout breaks — no shared bottles', checked: false },
  { id: 'kit', label: 'Official RVR Training Top', detail: 'Rivervalley Rangers blue/navy squad training jersey', checked: true },
  { id: 'jacket', label: 'Club Waterproof / Windbreaker', detail: 'Essential for Irish weather during warm-ups and sidelines', checked: false },
  { id: 'baselayer', label: 'Thermal Base Layer (Cold days)', detail: 'Navy/black skins for winter matchdays and evening sessions', checked: false },
];

export function TrainingSection() {
  const [checklist, setChecklist] = useState(INITIAL_CHECKLIST);

  const toggleItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const checkedCount = checklist.filter((i) => i.checked).length;

  return (
    <section className="public-section alt-bg" id="training">
      <div className="section-container">
        <div className="section-head">
          <div className="section-pill">
            <Calendar size={14} /> TRAINING PROTOCOLS & SCHEDULE
          </div>
          <h2>Weekly Training & Match Preparation</h2>
          <p>
            Standard session schedule, arrival expectations, weather policies, and matchday kit requirements for the 2014 squad.
          </p>
        </div>

        {/* Live Status Banner */}
        <div className="training-alert-box">
          <div className="alert-badge">
            <CloudSun size={18} />
            <span>PITCH STATUS: ALL CLEAR</span>
          </div>
          <p>
            Training is on schedule. In the event of heavy rain or council pitch closures, coaches notify via the WhatsApp group by 4:30 PM on session days.
          </p>
        </div>

        <div className="training-grid">
          {/* Timetable Cards */}
          <div className="schedule-column">
            <h3 className="subheading">Weekly Schedule (2026/27)</h3>

            <div className="schedule-card highlight">
              <div className="schedule-badge">TUESDAY EVENING</div>
              <div className="schedule-time">
                <Clock size={16} /> 6:30 PM – 7:45 PM
              </div>
              <h4>Technical Mastery & Game Patterns</h4>
              <p className="schedule-location">
                <MapPin size={15} /> Rivervalley Park (Pitch 2 Grass)
              </p>
              <div className="schedule-focus">
                <span>Focus: 1v1 duels, quick passing triangles, small-sided games</span>
              </div>
              <small className="arrival-note">Arrival: 6:15 PM sharp for dynamic warm-up</small>
            </div>

            <div className="schedule-card">
              <div className="schedule-badge secondary">THURSDAY EVENING</div>
              <div className="schedule-time">
                <Clock size={16} /> 7:00 PM – 8:15 PM
              </div>
              <h4>Tactical Shape & Set Pieces</h4>
              <p className="schedule-location">
                <MapPin size={15} /> All-Weather 4G Astro (Swords)
              </p>
              <div className="schedule-focus">
                <span>Focus: Positional awareness, pressing triggers, crossing & finishing</span>
              </div>
              <small className="arrival-note">Arrival: 6:45 PM sharp with Astro runners/molds</small>
            </div>

            <div className="schedule-card matchday">
              <div className="schedule-badge match">SATURDAY / SUNDAY</div>
              <div className="schedule-time">
                <Clock size={16} /> Weekend DDSL Fixtures
              </div>
              <h4>Official League & Cup Matches</h4>
              <p className="schedule-location">
                <MapPin size={15} /> Home: Rivervalley Park · Away: Across Dublin
              </p>
              <div className="schedule-focus">
                <span>Kick-off times confirmed each Wednesday on the DDSL portal</span>
              </div>
              <small className="arrival-note">Meet time: 45 minutes prior to kick-off</small>
            </div>
          </div>

          {/* Kit & Gear Checklist */}
          <div className="kit-column">
            <div className="kit-card">
              <div className="kit-header">
                <div>
                  <h3 className="subheading">Match & Training Kit Checklist</h3>
                  <p>Check off your gear before leaving the house:</p>
                </div>
                <div className="kit-progress-pill">
                  {checkedCount} / {checklist.length} Packed
                </div>
              </div>

              <div className="checklist-items">
                {checklist.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`checklist-btn ${item.checked ? 'is-checked' : ''}`}
                    onClick={() => toggleItem(item.id)}
                  >
                    <div className="check-icon">
                      {item.checked ? (
                        <CheckSquare size={19} className="checked-icon" />
                      ) : (
                        <Square size={19} />
                      )}
                    </div>
                    <div className="check-text">
                      <strong>{item.label}</strong>
                      <span>{item.detail}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="standards-box">
                <ShieldAlert size={18} />
                <div>
                  <strong>Squad Expectations:</strong>
                  <p>
                    Players are responsible for carrying their own gear bag and water bottle. Respect for referees, coaches, teammates, and opponents is non-negotiable at Rivervalley Rangers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
