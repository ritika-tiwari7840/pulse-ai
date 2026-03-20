'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AgentChatScreen from '@/components/agent/AgentChatScreen';

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

export default function AgentPage() {
  const router = useRouter();

  const [todayPlan, setTodayPlan] = useState<WorkoutPlan | null>(null);
  const [planName, setPlanName] = useState("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const selectedDate = localStorage.getItem('selected_date');
    const today = new Date().toLocaleDateString('en-CA');

    if (!selectedDate || selectedDate !== today) {
      router.replace('/dashboard');
      return;
    } else {
      setIsReady(true);
    }

    const savedPlan = localStorage.getItem('pulseai_plan');

    if (!savedPlan) return;

    const parsed = JSON.parse(savedPlan);

    setPlanName(parsed?.workout_plan?.plan_name);

    const dayName = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
    });

    const found = parsed?.workout_plan?.weekly_schedule?.find(
      (d: WorkoutPlan) =>
        d.day.toLowerCase() === dayName.toLowerCase()
    );

    setTodayPlan(found);
  }, [router]);

  if (!isReady) return null;

  return (
    <AgentChatScreen
      onExit={() => router.push('/dashboard')}
      todayPlan={todayPlan}
      planName={planName}
    />
  );
}