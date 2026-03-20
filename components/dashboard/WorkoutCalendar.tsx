'use client';

import { useEffect, useState } from 'react';

interface Props {
  onSelectDate: (date: string) => void;
}

export default function WorkoutCalendar({ onSelectDate }: Props) {
  const [today, setToday] = useState<string>("");
  const [streak, setStreak] = useState(0);
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // ✅ FIX: use local date instead of UTC
    const localTodayStr = new Date().toLocaleDateString('en-CA');
    setToday(localTodayStr);

    // Calculate Real Streak
    const todayDate = new Date();
    let computedStreak = 0;
    let computedTotal = 0;

    for (let i = 0; i < 30; i++) {
       const d = new Date(todayDate);
       d.setDate(d.getDate() - i);
       const dateStr = d.toLocaleDateString('en-CA');
       const isComp = localStorage.getItem(`completed_${dateStr}`) === 'true';
       
       if (isComp) computedTotal++;

       if (i === 0 && !isComp) {
         continue; // Didn't workout today yet, streak is still alive from yesterday
       }
       
       if (isComp) {
         computedStreak++;
       } else {
         break; // Streak broken
       }
    }
    setStreak(computedStreak);
    setTotalWorkouts(computedTotal);
  }, []);

  const getDates = () => {
    const dates: string[] = [];
    const now = new Date();

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(now.getDate() - i);

      // ✅ FIX HERE ALSO
      dates.push(d.toLocaleDateString('en-CA'));
    }

    return dates.reverse();
  };
  const isCompleted = (date: string) => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(`completed_${date}`) === 'true';
  };

  if (!isMounted) {
    return <div className="h-[250px] w-full animate-pulse bg-muted/20 rounded-2xl border border-border" />;
  }


  return (
    <div className="space-y-4">
      {/* 🚀 GLOWING STREAK BANNER */}
      <div className="flex items-center justify-between bg-card border rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full">
            <span className="text-2xl animate-pulse">🔥</span>
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight">
              {streak > 0 ? `${streak} Day Streak!` : 'Ready to Start?'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {streak > 0 ? "You're doing great. Keep it up!" : "Complete today's workout to start your streak."}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-2xl text-primary leading-none">{totalWorkouts}</p>
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mt-1">Workouts</p>
        </div>
      </div>

      {/* 📅 CALENDAR GRID */}
      <div className="grid grid-cols-7 gap-2 md:gap-3">
        {getDates().map((date) => {
          const isToday = date === today;
          const isFuture = date > today;
          const isPast = date < today;
          const completed = isCompleted(date);

          return (
            <div
              key={date}
              onClick={() => {
                if (!isFuture) onSelectDate(date);
              }}
              className={`
                relative flex flex-col justify-center items-center py-4 rounded-xl border transition-all duration-200
                ${isFuture ? 'opacity-40 cursor-not-allowed bg-muted/30 border-dashed' : 'cursor-pointer hover:border-primary/50'}
                ${completed && !isToday ? 'bg-gradient-to-br from-green-500/10 to-green-600/20 border-green-500/30 dark:border-green-400/20' : ''}
                ${isToday && completed ? 'bg-primary text-primary-foreground shadow-md ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
                ${isToday && !completed ? 'bg-card border-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]' : ''}
                ${isPast && !completed ? 'bg-muted/50 text-muted-foreground' : ''}
              `}
            >
              {/* DATE NUMBER */}
              <p className={`text-lg md:text-xl font-bold ${completed && !isToday ? 'text-green-600 dark:text-green-400' : ''}`}>
                {date.split('-')[2]}
              </p>

              {/* STATUS INDICATOR */}
              <p className="text-[10px] md:text-xs font-medium uppercase mt-1 tracking-wider opacity-80">
                {isFuture && 'Locked'}
                {isPast && !completed && 'Missed'}
                {completed && '✔ Done'}
                {isToday && !completed && 'Today'}
              </p>
              
              {/* HIGHLIGHT CURRENT DAY */}
              {isToday && <div className="absolute -bottom-1 w-full h-1 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full opacity-100" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}