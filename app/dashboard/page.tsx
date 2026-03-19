'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import LevelGrid from '@/components/dashboard/LevelGrid';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('pulseai_onboarding_complete');
    if (!hasCompletedOnboarding) {
      router.push('/onboarding');
    }
  }, [router]);

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Your Workout Plan</h1>
            <p className="text-muted-foreground mb-8">
              Click on any day to start your chat session with PulseAI
            </p>
            <LevelGrid />
          </div>
        </div>
      </div>
    </div>
  );
}
