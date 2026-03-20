'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import WorkoutCalendar from '@/components/dashboard/WorkoutCalendar';
import { useRouter } from 'next/navigation';

type HistoryItem = {
  dateStr: string;
  completed: boolean;
  dayName: string;
};

type ProgressData = {
  history: HistoryItem[];
  currentStreak: number;
  bestStreak: number;
  completedDays: number;
};

export default function ProgressPage() {
  const router = useRouter();
  const [data, setData] = useState<ProgressData>({
    history: [],
    currentStreak: 0,
    bestStreak: 0,
    completedDays: 0,
  });

  useEffect(() => {
    let total = 0;
    let maxStreak = 0;
    const past30: HistoryItem[] = [];
    
    // 1. Generate past 30 days
    const todayDate = new Date();
    for (let i = 0; i < 30; i++) {
       const d = new Date(todayDate);
       d.setDate(d.getDate() - i);
       const dateStr = d.toLocaleDateString('en-CA');
       const isComp = localStorage.getItem(`completed_${dateStr}`) === 'true';
       past30.push({ 
         dateStr, 
         completed: isComp, 
         dayName: d.toLocaleDateString('en-US', { weekday: 'short' }) 
       });
    }

    // Chronological order (oldest -> newest) for tracking max streak
    const chronological = [...past30].reverse();
    let tempStreak = 0;

    for (let i = 0; i < chronological.length; i++) {
        if (chronological[i].completed) {
           tempStreak++;
           total++;
           if (tempStreak > maxStreak) maxStreak = tempStreak;
        } else {
           tempStreak = 0;
        }
    }
    
    // 2. Current streak (go backwards from today)
    let currentStreak = 0;
    for (let i = 0; i < 30; i++) {
        const isComp = past30[i].completed; // past30 is newest -> oldest
        
        if (i === 0 && !isComp) continue; // Missed today but yesterday might be fine
        
        if (isComp) {
            currentStreak++;
        } else {
            break;
        }
    }

    setData({
       history: past30, // newest first
       currentStreak,
       bestStreak: maxStreak,
       completedDays: total,
    });
  }, []);

  const { currentStreak, bestStreak, completedDays, history } = data;

  const handleDateSelect = (date: string) => {
    const today = new Date().toLocaleDateString('en-CA');
    if (date !== today) return;
    localStorage.setItem('selected_date', date);
    router.push('/dashboard/agent');
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />

        <div className="flex-1 overflow-auto p-6 lg:p-10">
          <div className="max-w-6xl mx-auto space-y-8">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold mb-1">Your Progress</h1>
                <p className="text-muted-foreground">Track your fitness journey and milestones.</p>
              </div>
              
              <button 
                onClick={() => {
                  const todayDate = new Date();
                  // Mark the last 5 days as completed for a sweet 5-day streak
                  for (let i = 1; i <= 5; i++) {
                     const d = new Date(todayDate);
                     d.setDate(d.getDate() - i);
                     localStorage.setItem(`completed_${d.toLocaleDateString('en-CA')}`, 'true');
                  }
                  // Mark a random day 12 days ago
                  const oldDate = new Date(todayDate);
                  oldDate.setDate(oldDate.getDate() - 12);
                  localStorage.setItem(`completed_${oldDate.toLocaleDateString('en-CA')}`, 'true');
                  
                  window.location.reload();
                }}
                className="bg-accent/20 text-accent border border-accent/30 hover:bg-accent/30 px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm"
              >
                🧪 Seed Mock Data
              </button>
            </div>

            {/* 🔥 STATS SUMMARY */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-card border rounded-2xl p-6 shadow-sm relative overflow-hidden group hover:border-primary/50 transition-colors">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all" />
                <p className="text-muted-foreground text-sm font-medium mb-1">Current Streak</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-black text-primary">{currentStreak}</p>
                  <p className="text-sm text-muted-foreground font-semibold">days</p>
                </div>
              </div>

              <div className="bg-card border rounded-2xl p-6 shadow-sm relative overflow-hidden group hover:border-secondary/50 transition-colors">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-secondary/10 rounded-full blur-2xl group-hover:bg-secondary/20 transition-all" />
                <p className="text-muted-foreground text-sm font-medium mb-1">Best Streak</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-black text-secondary">{bestStreak}</p>
                  <p className="text-sm text-muted-foreground font-semibold">days</p>
                </div>
              </div>

              <div className="bg-card border rounded-2xl p-6 shadow-sm relative overflow-hidden group hover:border-accent/50 transition-colors">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-accent/10 rounded-full blur-2xl group-hover:bg-accent/20 transition-all" />
                <p className="text-muted-foreground text-sm font-medium mb-1">30-Day Total</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-black text-accent">{completedDays}</p>
                  <p className="text-sm text-muted-foreground font-semibold">workouts</p>
                </div>
              </div>

              <div className="bg-card border rounded-2xl p-6 shadow-sm relative overflow-hidden">
                <p className="text-muted-foreground text-sm font-medium mb-1">Completion Rate</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-black">{Math.round((completedDays / 30) * 100)}</p>
                  <p className="text-lg font-bold">%</p>
                </div>
              </div>
            </div>

            {/* 🗓️ CALENDAR WIDGET */}
            <div>
              <h2 className="text-xl font-bold mb-4">This Week</h2>
              <WorkoutCalendar onSelectDate={handleDateSelect} />
            </div>

            {/* 🟩 GITHUB STYLE COMMIT MAP */}
            <div className="bg-card border rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">30-Day Activity Map</h2>
              
              <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
                {[...history].reverse().map((day) => (
                  <div
                    key={day.dateStr}
                    title={`${day.dateStr}${day.completed ? ' - Completed' : ''}`}
                    className={`
                      aspect-square rounded-md flex items-center justify-center text-[10px] sm:text-xs border transition-all
                      ${day.completed 
                        ? 'bg-[#57F287] text-[#1e1f22] border-[#57F287]/50 shadow-[0_0_8px_rgba(87,242,135,0.4)] ring-1 ring-[#57F287]/40' 
                        : 'bg-muted/30 border-transparent text-muted-foreground/30'}
                    `}
                  >
                    {day.completed ? '🔥' : ''}
                  </div>
                ))}
              </div>
              <div className="flex justify-end items-center gap-2 mt-4 text-xs text-muted-foreground font-medium">
                <span>Missed</span>
                <div className="w-3 h-3 rounded-sm bg-muted/50" />
                <div className="w-3 h-3 rounded-sm bg-[#57F287] shadow-[0_0_5px_rgba(87,242,135,0.5)]" />
                <span>Completed</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}