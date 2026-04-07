'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CheckCircle2, Circle } from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import WorkoutCalendar from '@/components/dashboard/WorkoutCalendar';

// Types for the parsed plan
type Exercise = {
  name: string;
  sets: number;
  reps: number;
};

type WorkoutPlan = {
  day: string;
  focus: string;
  exercises: Exercise[];
};

export default function DashboardPage() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [todayPlan, setTodayPlan] = useState<WorkoutPlan | null>(null);
  const [planName, setPlanName] = useState("");
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [localTodayDate, setLocalTodayDate] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('pulseai_user_token');
    if (!token) {
      router.replace('/login');
      return;
    }

    const onboarded = localStorage.getItem('pulseai_onboarding_complete');
    if (!onboarded) {
      router.replace('/onboarding');
      return;
    } else {
      setIsReady(true);
    }

    // Load Plan
    const savedPlan = localStorage.getItem('pulseai_plan');
    if (!savedPlan) return;

    try {
      const parsed = JSON.parse(savedPlan);
      setPlanName(parsed?.workout_plan?.plan_name || "Daily Workout");

      const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      const localDateStr = new Date().toLocaleDateString('en-CA');
      setLocalTodayDate(localDateStr);

      const found = parsed?.workout_plan?.weekly_schedule?.find(
        (d: WorkoutPlan) => d.day.toLowerCase() === todayName.toLowerCase()
      );
      
      setTodayPlan(found || null);

      // Load specific completed exercises for today
      const savedCompleted = localStorage.getItem(`completed_exercises_${localDateStr}`);
      if (savedCompleted) {
        setCompletedExercises(JSON.parse(savedCompleted));
      }
    } catch(err) {
      console.error("Failed to parse plan", err);
    }
  }, [router]);

  const handleDateSelect = (date: string) => {
    localStorage.setItem('selected_date', date);
    router.push('/dashboard/agent');
  };

  const toggleExercise = (exerciseName: string) => {
    setCompletedExercises((prev) => {
      const isAlreadyCompleted = prev.includes(exerciseName);
      const updated = isAlreadyCompleted 
        ? prev.filter(name => name !== exerciseName)
        : [...prev, exerciseName];
      
      localStorage.setItem(`completed_exercises_${localTodayDate}`, JSON.stringify(updated));
      
      // If all are completed, mark the whole day as done automatically
      if (todayPlan?.exercises && updated.length === todayPlan.exercises.length) {
        localStorage.setItem(`completed_${localTodayDate}`, 'true');
        toast.success("All exercises completed! Day marked as done! 🔥");
        window.dispatchEvent(new Event('dashboard_streak_update'));
      } else {
        const wasCompleted = localStorage.getItem(`completed_${localTodayDate}`);
        if (wasCompleted) {
          localStorage.removeItem(`completed_${localTodayDate}`);
          window.dispatchEvent(new Event('dashboard_streak_update'));
        }
      }

      return updated;
    });
  };

  if (!isReady) return null;

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />

        <div className="p-6 lg:p-10 flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Calendar Widget */}
            <div>
              <h1 className="text-3xl font-extrabold mb-6">Overview</h1>
              <WorkoutCalendar onSelectDate={handleDateSelect} />
            </div>

            {/* Today's Plan */}
            <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 min-h-full bg-orange-500" />
              
              <h2 className="text-2xl font-bold mb-2">Today's Activity Plan</h2>
              
              {!todayPlan ? (
                <p className="text-muted-foreground">Gathering your plan...</p>
              ) : todayPlan.exercises?.length === 0 ? (
                <div className="text-center py-10 bg-muted/20 rounded-xl border border-dashed mt-4">
                  <p className="text-4xl mb-4">😌</p>
                  <p className="font-bold text-lg">It's a Rest Day!</p>
                  <p className="text-muted-foreground">Take it easy and recover.</p>
                </div>
              ) : (
                <>
                  <p className="text-primary font-medium mb-6">
                    {planName} • <span className="text-muted-foreground">{todayPlan.focus}</span>
                  </p>

                  <div className="space-y-3">
                    {todayPlan.exercises.map((ex, i) => {
                      const isDone = completedExercises.includes(ex.name);

                      return (
                        <div 
                          key={i} 
                          onClick={() => toggleExercise(ex.name)}
                          className={`
                            flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer group
                            ${isDone 
                               ? 'bg-primary/10 border-primary/30 opacity-60' 
                               : 'bg-background border-border hover:border-primary/50 hover:bg-muted/10'}
                          `}
                        >
                          <div className="flex items-center gap-4">
                            <button className={`
                              w-6 h-6 rounded-full flex items-center justify-center transition-colors
                              ${isDone ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}
                            `}>
                              {isDone ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                            </button>
                            <div>
                              <p className={`font-bold ${isDone ? 'line-through decoration-primary/50' : ''}`}>
                                {ex.name}
                              </p>
                              <p className="text-xs text-muted-foreground font-medium mt-1">
                                {ex.sets} SETS × {ex.reps} REPS
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}