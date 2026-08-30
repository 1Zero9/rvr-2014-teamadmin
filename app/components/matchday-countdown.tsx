'use client';

import { useEffect, useState } from 'react';
import { Clock, MapPin } from 'lucide-react';

interface MatchdayCountdownProps {
  opponent: string;
  matchDateStr?: string;
  kickoffTime?: string;
  venue?: string;
}

export function MatchdayCountdown({
  opponent,
  matchDateStr = '05 Sep 2026',
  kickoffTime = '11:00',
  venue = 'Deerpark',
}: MatchdayCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 5, hours: 14, minutes: 20, seconds: 0 });

  useEffect(() => {
    // Parse target fixture date & kickoff time
    const now = new Date();
    let target = new Date();

    if (matchDateStr && matchDateStr !== 'TBC') {
      const parsedDate = new Date(matchDateStr);
      if (!isNaN(parsedDate.getTime())) {
        target = parsedDate;
      } else {
        // Find next Saturday
        const dayOfWeek = now.getDay();
        const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7;
        target = new Date(now);
        target.setDate(now.getDate() + daysUntilSaturday);
      }
    } else {
      const dayOfWeek = now.getDay();
      const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7;
      target = new Date(now);
      target.setDate(now.getDate() + daysUntilSaturday);
    }

    // Set kickoff time
    if (kickoffTime && kickoffTime.includes(':')) {
      const [h, m] = kickoffTime.split(':').map((n) => parseInt(n, 10));
      target.setHours(h || 11, m || 0, 0, 0);
    } else {
      target.setHours(11, 0, 0, 0);
    }

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
  }, [matchDateStr, kickoffTime]);

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
      <span className="countdown-opponent-tag">
        vs {opponent} ({kickoffTime || '11:00 AM'})
      </span>
    </div>
  );
}
