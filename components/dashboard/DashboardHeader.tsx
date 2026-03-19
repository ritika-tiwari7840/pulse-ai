'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function DashboardHeader() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('pulseai_onboarding_complete');
    router.push('/onboarding');
  };

  return (
    <div className="bg-card border-b border-border px-6 py-4 flex justify-between items-center">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Welcome to PulseAI</h2>
        <p className="text-sm text-muted-foreground">
          Complete your daily workout to build streaks
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="text-foreground border-border hover:bg-input"
        >
          Start Over
        </Button>
      </div>
    </div>
  );
}
