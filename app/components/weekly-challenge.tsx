'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Award,
  CheckCircle2,
  ChevronRight,
  Flame,
  Play,
  Sparkles,
  Trophy,
  Zap,
} from 'lucide-react';

export function WeeklyChallenge() {
  const [completedSteps, setCompletedSteps] = useState<number[]>([0]);

  const challenge = {
    weekNumber: 1,
    title: 'Double Touch & Cruyff Turn Finishing',
    subtitle: 'Master the sharp redirection and rapid low driven shot',
    xpValue: 150,
    badgeName: 'Week 1 Skill Master',
    badgeIcon: '🔥',
    steps: [
      { id: 0, text: 'Warm up: 50 two-footed ball taps on the spot', target: '50 reps' },
      { id: 1, text: 'The Cruyff Cut: 20 sharp cuts behind your standing leg (both feet)', target: '20 cuts' },
      { id: 2, text: '1v1 Dribble & Blast: 10 driven strikes into the bottom corner', target: '10 goals' },
    ],
  };

  const toggleStep = (id: number) => {
    setCompletedSteps((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const progressPercent = Math.round((completedSteps.length / challenge.steps.length) * 100);
  const isAllDone = completedSteps.length === challenge.steps.length;

  return (
    <section className="weekly-challenge-section">
      <div className="section-container">
        <div className="challenge-card">
          <div className="challenge-head-strip">
            <div className="challenge-pill">
              <Sparkles size={13} /> WEEKLY PLAYER QUEST · WEEK {challenge.weekNumber}
            </div>
            <div className="challenge-xp-badge">
              <Flame size={14} className="text-amber-400" />
              <span>+{challenge.xpValue} XP Available</span>
            </div>
          </div>

          <div className="challenge-body-grid">
            <div className="challenge-main">
              <h3>{challenge.title}</h3>
              <p>{challenge.subtitle}</p>

              <div className="challenge-progress-bar-wrap">
                <div className="progress-label-row">
                  <span>Quest Progress</span>
                  <strong>{completedSteps.length} of {challenge.steps.length} Completed ({progressPercent}%)</strong>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="challenge-checklist">
                {challenge.steps.map((step) => {
                  const done = completedSteps.includes(step.id);
                  return (
                    <button
                      key={step.id}
                      type="button"
                      className={`challenge-step-row ${done ? 'is-done' : ''}`}
                      onClick={() => toggleStep(step.id)}
                    >
                      <div className="step-check-box">
                        <CheckCircle2 size={18} className={done ? 'text-emerald-500' : 'text-slate-300'} />
                      </div>
                      <span className="step-text">{step.text}</span>
                      <span className="step-target-pill">{step.target}</span>
                    </button>
                  );
                })}
              </div>

              <div className="challenge-actions-row">
                <Link href="/skills" className="challenge-video-btn">
                  <Play size={14} fill="currentColor" /> Watch Video Tutorial in Skills Vault
                </Link>
                {isAllDone && (
                  <div className="quest-unlocked-badge">
                    <span>🎉 Quest Completed! Badge Unlocked</span>
                  </div>
                )}
              </div>
            </div>

            <div className="challenge-badge-box">
              <div className="badge-glow-circle">
                <span className="badge-emoji">{challenge.badgeIcon}</span>
              </div>
              <h4>{challenge.badgeName}</h4>
              <p>Complete all 3 drills in your back garden or at training to unlock this week’s honor!</p>
              <div className="badge-level-pill">
                <Trophy size={13} /> Level 1 Mastery
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
