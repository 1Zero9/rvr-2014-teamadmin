'use client';

import { useState } from 'react';
import { Activity, Dumbbell, Flame, Shield, Timer, Zap, Check, HeartPulse } from 'lucide-react';

interface Routine {
  id: string;
  category: string;
  title: string;
  duration: string;
  description: string;
  drills: {
    name: string;
    sets: string;
    cues: string;
  }[];
}

const ROUTINES: Routine[] = [
  {
    id: 'warmup',
    category: 'Pre-Session',
    title: 'FIFA 11+ Dynamic Activation',
    duration: '10 Mins',
    description:
      'Compulsory pre-training and pre-match activation routine designed to reduce knee and ankle injury rates by up to 50%.',
    drills: [
      { name: 'Straight Line Jog & Arm Circles', sets: '2 × 20m', cues: 'Light relaxed pace, open chest and shoulders' },
      { name: 'Hip Openers (Open & Close the Gate)', sets: '2 × 10 each leg', cues: 'Bring knee up high to 90 degrees then rotate outward' },
      { name: 'Lateral Shuffles & High Knee Skips', sets: '2 × 15m', cues: 'Stay low in athletic stance, avoid crossing ankles' },
      { name: 'Plant & Decelerate (Stop on the Whistle)', sets: '4 repetitions', cues: 'Sink hips into squat position on braking' },
    ],
  },
  {
    id: 'speed-agility',
    category: 'Speed & Agility',
    title: 'Acceleration & Change of Direction',
    duration: '15 Mins',
    description:
      'Sharp explosive movements emphasizing first-step burst, arm drive, and rapid deceleration without losing balance.',
    drills: [
      { name: '5-10-5 Pro Agility Shuttle', sets: '4 reps (2 left, 2 right)', cues: 'Touch ground with outside hand, low center of gravity' },
      { name: 'Ladder Icky Shuffle & Single-Leg Hop', sets: '3 sets each foot', cues: 'Quick light taps on ball of feet, maintain rhythm' },
      { name: '10m Explosive Sprint from Prone Start', sets: '5 repetitions', cues: 'Drive elbows back powerfully, keep eyes up' },
    ],
  },
  {
    id: 'core-stability',
    category: 'Bodyweight Strength',
    title: 'Core & Lower-Body Stability',
    duration: '12 Mins',
    description:
      'Zero-weight functional exercises building strong hips, core resilience for shoulder-to-shoulder duels, and joint stability.',
    drills: [
      { name: 'Forearm Plank with Shoulder Taps', sets: '3 × 30 seconds', cues: 'Squeeze glutes, prevent hips from swaying side to side' },
      { name: 'Single-Leg Glute Bridge', sets: '3 × 10 each leg', cues: 'Drive heel into ground, pause at the top for 1 second' },
      { name: 'Prisoner Bodyweight Squats', sets: '3 × 12 reps', cues: 'Knees track over toes, chest upright, full depth' },
      { name: 'Lateral Skater Hops (Stick the Landing)', sets: '3 × 8 each side', cues: 'Land softly on one foot, hold balance for 2 seconds' },
    ],
  },
  {
    id: 'recovery',
    category: 'Post-Match',
    title: 'Post-Match Flush & Mobility',
    duration: '8 Mins',
    description:
      'Gentle active cool down to flush metabolic waste, maintain hamstring and groin mobility, and prevent muscle tightness.',
    drills: [
      { name: 'Light 2-Minute Recovery Jog / Walk', sets: '1 × 2 mins', cues: 'Deep nasal breathing to bring heart rate down' },
      { name: 'Dynamic Hamstring Sweeps', sets: '2 × 10 sweeps', cues: 'Heel on ground with toes pointing up, sweep ground with hands' },
      { name: 'Kneeling Hip Flexor & Quad Stretch', sets: '30s hold each side', cues: 'Tuck pelvis forward until stretch is felt in front of hip' },
      { name: 'Standing Calf & Achilles Stretch', sets: '30s hold each calf', cues: 'Keep back heel flat on grass, lean gently into wall/fence' },
    ],
  },
];

export function SCSection() {
  const [selectedRoutine, setSelectedRoutine] = useState<string>('warmup');

  const currentRoutine = ROUTINES.find((r) => r.id === selectedRoutine) ?? ROUTINES[0];

  return (
    <section className="public-section" id="sc">
      <div className="section-container">
        <div className="section-head">
          <div className="section-pill">
            <Zap size={14} /> STRENGTH & CONDITIONING
          </div>
          <h2>Youth Athletic Development (2014 Squad)</h2>
          <p>
            Age-tailored athletic protocols focusing on speed mechanics, injury prevention, core stability, and match readiness.
          </p>
        </div>

        {/* Routine Category Selector */}
        <div className="sc-tabs">
          {ROUTINES.map((routine) => (
            <button
              key={routine.id}
              type="button"
              className={`sc-tab-btn ${selectedRoutine === routine.id ? 'active' : ''}`}
              onClick={() => setSelectedRoutine(routine.id)}
            >
              <span className="sc-tab-category">{routine.category}</span>
              <strong>{routine.title}</strong>
              <small>
                <Timer size={12} /> {routine.duration}
              </small>
            </button>
          ))}
        </div>

        {/* Selected Routine Detail */}
        <div className="sc-detail-card">
          <div className="sc-detail-header">
            <div>
              <span className="sc-detail-badge">{currentRoutine.category} Protocol</span>
              <h3>{currentRoutine.title}</h3>
              <p>{currentRoutine.description}</p>
            </div>
            <div className="sc-time-badge">
              <Timer size={18} />
              <span>{currentRoutine.duration} Session</span>
            </div>
          </div>

          <div className="sc-drills-list">
            <h4>Exercise Sequence & Execution Details:</h4>
            <div className="sc-drills-grid">
              {currentRoutine.drills.map((drill, index) => (
                <div className="sc-drill-item" key={index}>
                  <div className="sc-drill-number">{index + 1}</div>
                  <div className="sc-drill-content">
                    <div className="sc-drill-title-row">
                      <h5>{drill.name}</h5>
                      <span className="sc-drill-sets">{drill.sets}</span>
                    </div>
                    <p className="sc-drill-cues">
                      <strong>Coaching Key:</strong> {drill.cues}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sc-footer-note">
            <Shield size={16} />
            <span>
              <strong>Coach Note:</strong> For 2014 players (U13), form and movement quality always come before speed. Never compromise technique to complete repetitions faster.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
