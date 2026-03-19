'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AgentChatScreen from '@/components/agent/AgentChatScreen';

export default function AgentPage() {
  const router = useRouter();

  const [todayPlan, setTodayPlan] = useState<any>(null);
  const [planName, setPlanName] = useState("");

  useEffect(() => {
    const selectedDate = localStorage.getItem('selected_date');
    const today = new Date().toLocaleDateString('en-CA');

    if (!selectedDate || selectedDate !== today) {
      router.push('/dashboard');
      return;
    }

    const savedPlan = localStorage.getItem('pulseai_plan');

    if (!savedPlan) return;

    const parsed = JSON.parse(savedPlan);

    setPlanName(parsed?.workout_plan?.plan_name);

    const dayName = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
    });

    const found = parsed?.workout_plan?.weekly_schedule?.find(
      (d: any) =>
        d.day.toLowerCase() === dayName.toLowerCase()
    );

    setTodayPlan(found);
  }, []);

  return (
    <AgentChatScreen
      onExit={() => router.push('/dashboard')}
      todayPlan={todayPlan}
      planName={planName}
    />
  );
}