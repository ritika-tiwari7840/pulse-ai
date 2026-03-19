'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import WorkoutCalendar from '@/components/dashboard/WorkoutCalendar';

export default function DashboardPage() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const onboarded = localStorage.getItem('pulseai_onboarding_complete');

    if (!onboarded) {
      router.push('/onboarding');
    } else {
      setIsReady(true);
    }
  }, []);

  const handleDateSelect = (date: string) => {
    const today = new Date().toLocaleDateString('en-CA');

    if (date !== today) {
      alert("Only today's workout allowed");
      return;
    }

    localStorage.setItem('selected_date', date);

    router.push('/dashboard/agent');
  };

  if (!isReady) return <p>Loading...</p>;

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 p-6">
        <DashboardHeader />

        <h1 className="text-2xl font-bold mb-4">Workout Calendar</h1>

        <WorkoutCalendar onSelectDate={handleDateSelect} />
      </div>
    </div>
  );
}