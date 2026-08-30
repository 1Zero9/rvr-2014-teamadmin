'use client';

import { useState } from 'react';
import { Play, Sparkles, Target, CheckCircle2, Clock, Flame, ChevronRight, X } from 'lucide-react';

interface Drill {
  id: string;
  title: string;
  category: 'mastery' | '1v1' | 'passing' | 'finishing' | 'defending';
  difficulty: 'Foundation' | 'Intermediate' | 'Advanced';
  duration: string;
  reps: string;
  description: string;
  coachingPoints: string[];
  videoUrl: string; // YouTube embed ID
  focus: string;
}

const DRILLS: Drill[] = [
  {
    id: 'la-croqueta',
    title: 'The "La Croqueta" & Body Feint',
    category: '1v1',
    difficulty: 'Intermediate',
    duration: '10 Mins',
    reps: '4 sets × 10 reps (both feet)',
    description:
      'Shift the ball smoothly from the inside of one foot to the other in a single fluid motion to glide past an onrushing defender.',
    coachingPoints: [
      'Drop your shoulder before shifting to sell the fake',
      'Keep the ball close — do not let it bounce away',
      'Accelerate into space immediately after the second touch',
    ],
    videoUrl: 'https://www.youtube-nocookie.com/embed/n42s5Y3Fm4c',
    focus: '1v1 attacking, agility, balance',
  },
  {
    id: 'v-drag-push',
    title: 'V-Drag Push & Turn',
    category: 'mastery',
    difficulty: 'Foundation',
    duration: '8 Mins',
    reps: '3 sets × 15 reps',
    description:
      'Drag the ball back with the sole of your foot, open your hips, and push it diagonally forward with the inside/outside of the same foot.',
    coachingPoints: [
      'Bend knees and stay on the balls of your feet',
      'Protect the ball with your body between the ball and defender',
      'Quick snap of the ankle on the push phase',
    ],
    videoUrl: 'https://www.youtube-nocookie.com/embed/Q0vF0lKq5-4',
    focus: 'Tight space escape, ball manipulation',
  },
  {
    id: 'two-touch-wall',
    title: '2-Touch Scanning Wall Rebounds',
    category: 'passing',
    difficulty: 'Foundation',
    duration: '12 Mins',
    reps: '50 passes with left, 50 with right',
    description:
      'Firm side-foot pass against a rebounder or wall. Glance over your shoulder before the ball returns to practice 360° pitch awareness.',
    coachingPoints: [
      'Lock ankle and point toes slightly upward on contact',
      'First touch should guide the ball across your body to set up the return pass',
      'Scan shoulder while the ball is traveling',
    ],
    videoUrl: 'https://www.youtube-nocookie.com/embed/l2g_04t5eUQ',
    focus: 'First touch, receiving across body, peripheral vision',
  },
  {
    id: 'curling-strike',
    title: 'Precision Finishing: Inside Curl',
    category: 'finishing',
    difficulty: 'Intermediate',
    duration: '15 Mins',
    reps: '4 sets × 8 strikes from edge of box',
    description:
      'Approaching the penalty area from an angle, wrap the inside of your foot around the ball to bend it into the far side netting.',
    coachingPoints: [
      'Plant standing foot pointing toward the target corner',
      'Lean chest over the ball to prevent the shot from ballooning over',
      'Follow through in the arc of the intended curve',
    ],
    videoUrl: 'https://www.youtube-nocookie.com/embed/fW_1u8hC7rE',
    focus: 'Shooting technique, ball trajectory, accuracy',
  },
  {
    id: 'step-over-burst',
    title: 'Single & Double Step-Over',
    category: '1v1',
    difficulty: 'Intermediate',
    duration: '10 Mins',
    reps: '4 sets × 6 explosive bursts',
    description:
      'Circle your foot around the front of the ball without touching it, shift your weight, and explode in the opposite direction with the outside of your other foot.',
    coachingPoints: [
      'Exaggerate the head and hip drop on the step-over',
      'Make sure the step goes cleanly around the ball, not over the top',
      'Explosive first 3 steps after changing direction',
    ],
    videoUrl: 'https://www.youtube-nocookie.com/embed/e13g64l29i8',
    focus: 'Deception, change of pace, confidence in 1v1',
  },
  {
    id: 'jockey-channel',
    title: '1v1 Defensive Jockeying & Channeling',
    category: 'defending',
    difficulty: 'Intermediate',
    duration: '12 Mins',
    reps: '4 sets × 45-second shadow duels',
    description:
      'Stay side-on at an arm’s length from the attacker, forcing them toward the sideline or onto their weaker foot before timing the tackle.',
    coachingPoints: [
      'Never dive in or cross your feet while backtracking',
      'Stay low with a boxer-style staggered stance',
      'Strike to win the ball only when the attacker takes a heavy touch',
    ],
    videoUrl: 'https://www.youtube-nocookie.com/embed/04n3N8e5Q5I',
    focus: 'Body shape, patience, timing interceptions',
  },
  {
    id: 'cruyff-turn',
    title: 'The Cruyff Turn & Quick Release',
    category: 'mastery',
    difficulty: 'Foundation',
    duration: '8 Mins',
    reps: '3 sets × 12 reps',
    description:
      'Fake a shot or cross, then hook the ball behind your standing leg with the inside of your kicking foot to completely reverse direction.',
    coachingPoints: [
      'Sell the fake cross with a high backswing and arm extension',
      'Hop on the standing leg to create room for the ball to pass behind',
      'Lift head up immediately after turning',
    ],
    videoUrl: 'https://www.youtube-nocookie.com/embed/n42s5Y3Fm4c',
    focus: 'Shielding, turning away from pressure',
  },
  {
    id: 'driven-pass',
    title: 'Low Driven Pass (Laces Technique)',
    category: 'passing',
    difficulty: 'Advanced',
    duration: '15 Mins',
    reps: '20 long driven passes each foot',
    description:
      'Deliver a fast, flat, driven ball across the pitch using the top of the laces through the center of the ball with low trajectory.',
    coachingPoints: [
      'Strike dead-center of the ball with toes pointed straight down',
      'Keep your knee directly over the ball on contact',
      'Land on your kicking foot to generate maximum clean power',
    ],
    videoUrl: 'https://www.youtube-nocookie.com/embed/l2g_04t5eUQ',
    focus: 'Switching play, counter-attacking passes',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Drills' },
  { id: '1v1', label: '1v1 & Dribbling' },
  { id: 'mastery', label: 'Ball Mastery' },
  { id: 'passing', label: 'Passing & First Touch' },
  { id: 'finishing', label: 'Finishing & Striking' },
  { id: 'defending', label: 'Defending' },
];

export function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedDrill, setSelectedDrill] = useState<Drill | null>(null);

  const filteredDrills =
    activeCategory === 'all'
      ? DRILLS
      : DRILLS.filter((d) => d.category === activeCategory);

  return (
    <section className="public-section" id="skills">
      <div className="section-container">
        <div className="section-head">
          <div className="section-pill">
            <Sparkles size={14} /> SKILLS & DRILLS VAULT
          </div>
          <h2>Master Your Technique at Home</h2>
          <p>
            Curated football skills, footwork drills, and tactical habits specifically calibrated for 2014 youth development.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="filter-bar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`filter-tab ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Drill Cards Grid */}
        <div className="drills-grid">
          {filteredDrills.map((drill) => (
            <article className="drill-card" key={drill.id}>
              <div className="drill-card-top">
                <span className={`diff-badge ${drill.difficulty.toLowerCase()}`}>
                  {drill.difficulty}
                </span>
                <span className="duration-tag">
                  <Clock size={13} /> {drill.duration}
                </span>
              </div>

              <h3>{drill.title}</h3>
              <p className="drill-desc">{drill.description}</p>

              <div className="drill-meta-box">
                <div className="meta-item">
                  <Target size={14} />
                  <span><strong>Target:</strong> {drill.reps}</span>
                </div>
                <div className="meta-item">
                  <Flame size={14} />
                  <span><strong>Focus:</strong> {drill.focus}</span>
                </div>
              </div>

              <div className="drill-cues">
                <strong>Key Coaching Points:</strong>
                <ul>
                  {drill.coachingPoints.slice(0, 2).map((point, i) => (
                    <li key={i}>
                      <CheckCircle2 size={13} /> <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                className="drill-play-btn"
                onClick={() => setSelectedDrill(drill)}
              >
                <Play size={16} fill="currentColor" /> Watch Drill Demonstration
              </button>
            </article>
          ))}
        </div>

        {/* Modal Player */}
        {selectedDrill && (
          <div className="modal-backdrop" onClick={() => setSelectedDrill(null)}>
            <div className="drill-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <span className="modal-tag">{selectedDrill.difficulty} Drill</span>
                  <h3>{selectedDrill.title}</h3>
                </div>
                <button
                  type="button"
                  className="modal-close"
                  onClick={() => setSelectedDrill(null)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="video-container">
                <iframe
                  src={selectedDrill.videoUrl}
                  title={selectedDrill.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="modal-body">
                <div className="modal-section">
                  <h4>Coaching Cues & Execution</h4>
                  <ul>
                    {selectedDrill.coachingPoints.map((p, idx) => (
                      <li key={idx}>
                        <CheckCircle2 size={16} /> <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="modal-metrics">
                  <div>
                    <span>Recommended Reps</span>
                    <strong>{selectedDrill.reps}</strong>
                  </div>
                  <div>
                    <span>Session Time</span>
                    <strong>{selectedDrill.duration}</strong>
                  </div>
                  <div>
                    <span>Core Skill Target</span>
                    <strong>{selectedDrill.focus}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
