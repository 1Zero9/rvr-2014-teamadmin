'use client';

import { useEffect, useState } from 'react';
import { Clock, Flame, Zap } from 'lucide-react';

interface MatchdayCountdownProps {
  opponent: string;
  matchDateStr?: string;
  venue?: string;
}

export function MatchdayCountdown({ opponent, matchDateStr = 'Sat 5th Sept 2026', venue }: MatchdayCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 5, hours: 14, minutes: 22, seconds: 40 });

  useEffect(() => {
    // Target next Saturday 10:30 AM matchday
    const now = new Date();
    const target = new Date();
    // Next Saturday
    const dayOfWeek = target.getDay(); // 0 is Sunday, 6 is Saturday
    const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7;
    target.setDate(now.getDate() + daysUntilSaturday);
    target.setHours(10, 30, 0, 0);

    const updateTimer = () => {
      const current = new Date().getTime();
      const diff = target.getTime() - current;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hero-countdown-wrap">
      <span className="countdown-label">
        <Clock size={13} className="animate-spin text-amber-400" />
        <span>NEXT MATCHDAY:</span>
      </span>
      <div className="countdown-timer-units">
        <span className="countdown-unit">{timeLeft.days}d</span>
        <span>:</span>
        <span className="countdown-unit">{String(timeLeft.hours).padStart(2, '0')}h</span>
        <span>:</span>
        <span className="countdown-unit">{String(timeLeft.minutes).padStart(2, '0')}m</span>
        <span>:</span>
        <span className="countdown-unit text-amber-300">{String(timeLeft.seconds).padStart(2, '0')}s</span>
      </div>
      <span className="countdown-opponent-tag">vs {opponent}</span>
    </div>
  );
}
