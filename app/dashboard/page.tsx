'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import WorkoutCalendar from '@/components/dashboard/WorkoutCalendar';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const onboarded = localStorage.getItem('pulseai_onboarding_complete');
    if (!onboarded) {
      router.push('/onboarding');
    }
  }, []);

  const handleDateSelect = (date: string) => {
    localStorage.setItem('selected_date', date);
    router.push('/dashboard/agent');
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">
            Your Workout Calendar
          </h1>

          <WorkoutCalendar onSelectDate={handleDateSelect} />
        </div>
      </div>
    </div>
  );
}