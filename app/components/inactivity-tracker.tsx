'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Clock, LogOut, ShieldAlert } from 'lucide-react';

interface InactivityTrackerProps {
  timeoutMinutes?: number;
}

export function InactivityTracker({ timeoutMinutes = 15 }: InactivityTrackerProps) {
  const router = useRouter();
  const [showWarning, setShowWarning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(60);

  const timeoutMs = timeoutMinutes * 60 * 1000;
  const warningMs = Math.max(timeoutMs - 60 * 1000, 30 * 1000); // 1 minute before timeout

  const lastActivityRef = useRef<number>(Date.now());
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    lastActivityRef.current = Date.now();
    setShowWarning(false);
    setSecondsRemaining(60);

    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
    }

    warningTimerRef.current = setTimeout(() => {
      setShowWarning(true);
      setSecondsRemaining(60);

      countdownIntervalRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
            // Inactivity reached -> Redirect to login with timeout
            window.location.href = '/login?error=timeout';
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, warningMs);
  };

  useEffect(() => {
    const activityEvents = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];

    const handleUserActivity = () => {
      // If warning is not visible, reset
      if (!showWarning) {
        // Throttle activity resets to every 5 seconds
        if (Date.now() - lastActivityRef.current > 5000) {
          resetTimer();
        }
      }
    };

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleUserActivity, { passive: true });
    });

    resetTimer();

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [showWarning, timeoutMs, warningMs]);

  if (!showWarning) return null;

  return (
    <div className="inactivity-warning-overlay">
      <div className="inactivity-modal">
        <div className="inactivity-modal-head">
          <div className="warning-icon-circle">
            <Clock size={24} className="text-amber-500 animate-pulse" />
          </div>
          <div>
            <h3>Session Inactivity Warning</h3>
            <p>You have been inactive on the squad management portal.</p>
          </div>
        </div>

        <div className="inactivity-countdown-box">
          <span>Automatic logout in</span>
          <strong className="text-amber-500 font-mono text-xl">{secondsRemaining}s</strong>
        </div>

        <div className="inactivity-buttons-row">
          <button
            type="button"
            className="stay-logged-in-btn"
            onClick={resetTimer}
          >
            I&apos;m Still Here (Stay Logged In)
          </button>
          <button
            type="button"
            className="logout-now-btn"
            onClick={() => {
              window.location.href = '/login?error=timeout';
            }}
          >
            <LogOut size={14} /> Log Out Now
          </button>
        </div>
      </div>
    </div>
  );
}
