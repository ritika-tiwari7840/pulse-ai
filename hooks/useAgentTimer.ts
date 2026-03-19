'use client';

import { useEffect, useRef } from 'react';
import { useAgent } from '@/context/AgentContext';

const TARGET_MINUTES = 10;
const TARGET_SECONDS = TARGET_MINUTES * 60;

export function useAgentTimer() {
  const { elapsedTime, setElapsedTime, isPaused, setIsPaused, streakEarned, setStreakEarned } =
    useAgent();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionStartRef = useRef<number>(Date.now());

  // Resume timer on mount
  useEffect(() => {
    sessionStartRef.current = Date.now();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Timer logic
  useEffect(() => {
    if (isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setElapsedTime((prev) => {
        const newTime = prev + 1;
        if (newTime >= TARGET_SECONDS && !streakEarned) {
          setStreakEarned(true);
        }
        return newTime;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, streakEarned, setElapsedTime, setStreakEarned]);

  const pause = () => setIsPaused(true);
  const resume = () => setIsPaused(false);
  const timeRemaining = Math.max(0, TARGET_SECONDS - elapsedTime);
  const hasEarnedStreak = elapsedTime >= TARGET_SECONDS;
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;

  return {
    elapsedTime,
    timeRemaining,
    minutes,
    seconds,
    hasEarnedStreak,
    isPaused,
    pause,
    resume,
    targetSeconds: TARGET_SECONDS,
  };
}
