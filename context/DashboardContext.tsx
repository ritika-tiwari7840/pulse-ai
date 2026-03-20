'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface DayLevel {
  day: number;
  completed: boolean;
  streakCount: number;
  lastCompletedDate?: string;
}

interface DashboardContextType {
  currentDay: number | null;
  setCurrentDay: (day: number | null) => void;
  levels: DayLevel[];
  updateLevel: (day: number, updates: Partial<DayLevel>) => void;
  currentStreak: number;
  bestStreak: number;
  loadDashboardState: () => void;
  saveDashboardState: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

const STORAGE_KEY = 'pulseai_dashboard';

function initializeLevels(): DayLevel[] {
  const levels: DayLevel[] = [];
  for (let i = 1; i <= 30; i++) {
    levels.push({
      day: i,
      completed: false,
      streakCount: 0,
    });
  }
  return levels;
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [levels, setLevels] = useState<DayLevel[]>([]);
  const [currentDay, setCurrentDay] = useState<number | null>(null);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadDashboardState = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const { levels: savedLevels, bestStreak: bs } = JSON.parse(saved);
          setLevels(savedLevels);
          setBestStreak(bs || 0);
        } catch (e) {
          console.error('Failed to load dashboard state:', e);
          setLevels(initializeLevels());
        }
      } else {
        setLevels(initializeLevels());
      }
      
      // Calculate real streak from completed workouts instead of using saved placeholder value
      const todayDate = new Date();
      let computedStreak = 0;
      for (let i = 0; i < 30; i++) {
         const d = new Date(todayDate);
         d.setDate(d.getDate() - i);
         const dateStr = d.toLocaleDateString('en-CA');
         const isComp = localStorage.getItem(`completed_${dateStr}`) === 'true';
         
         if (i === 0 && !isComp) continue;
         
         if (isComp) {
           computedStreak++;
         } else {
           break;
         }
      }
      setCurrentStreak(computedStreak);

      setIsLoaded(true);
    }
  };

  const saveDashboardState = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          levels,
          currentStreak,
          bestStreak,
        })
      );
    }
  };

  useEffect(() => {
    loadDashboardState();
    
    const handleStreakUpdate = () => {
      loadDashboardState();
    };
    window.addEventListener('dashboard_streak_update', handleStreakUpdate);
    
    return () => {
      window.removeEventListener('dashboard_streak_update', handleStreakUpdate);
    };
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveDashboardState();
    }
  }, [levels, currentStreak, bestStreak, isLoaded]);

  const updateLevel = (day: number, updates: Partial<DayLevel>) => {
    setLevels((prev) =>
      prev.map((level) =>
        level.day === day ? { ...level, ...updates } : level
      )
    );
  };

  return (
    <DashboardContext.Provider
      value={{
        currentDay,
        setCurrentDay,
        levels,
        updateLevel,
        currentStreak,
        bestStreak,
        loadDashboardState,
        saveDashboardState,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
}
