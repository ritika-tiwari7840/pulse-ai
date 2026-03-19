'use client';

import { DayLevel } from '@/context/DashboardContext';

interface DayLevelProps {
  level: DayLevel;
}

export default function DayLevelComponent({ level }: DayLevelProps) {
  const isCompleted = level.completed && level.streakCount > 0;
  const hasEarned = level.streakCount > 0;

  return (
    <div
      className={`
        aspect-square rounded-xl border-2 flex flex-col items-center justify-center
        transition-all duration-300 font-bold text-lg
        ${
          isCompleted
            ? 'bg-gradient-to-br from-secondary to-primary border-secondary shadow-lg'
            : 'bg-gradient-to-br from-card to-input border-border hover:border-primary hover:shadow-lg'
        }
        hover:scale-105 active:scale-95
      `}
    >
      <div className="flex flex-col items-center gap-1">
        {/* Level number */}
        <div className={`text-2xl font-bold ${isCompleted ? 'text-sidebar-primary-foreground' : 'text-foreground'}`}>
          {level.day}
        </div>

        {/* Streak indicator with fire emoji */}
        {hasEarned && (
          <div className="flex items-center gap-1 mt-2">
            <span className="text-2xl">🔥</span>
            <span className={`text-sm font-bold ${isCompleted ? 'text-sidebar-primary-foreground' : 'text-accent'}`}>
              {level.streakCount}
            </span>
          </div>
        )}

        {/* Status text */}
        <div className={`text-xs mt-2 font-medium ${isCompleted ? 'text-sidebar-primary-foreground/80' : 'text-muted-foreground'}`}>
          {isCompleted ? 'Completed' : 'Available'}
        </div>
      </div>

      {/* Glow effect for active levels */}
      {isCompleted && (
        <div className="absolute inset-0 rounded-xl bg-secondary/20 blur-lg -z-10" />
      )}
    </div>
  );
}
