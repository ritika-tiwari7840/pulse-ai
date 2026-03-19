'use client';

import { Button } from '@/components/ui/button';

interface StreakEarnedModalProps {
  onClose: () => void;
}

export default function StreakEarnedModal({ onClose }: StreakEarnedModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-card border-2 border-accent rounded-2xl p-8 max-w-md w-full text-center animate-bounce-in">
        {/* Celebration animation */}
        <div className="text-6xl mb-4 inline-block">
          🎉
        </div>

        <h2 className="text-3xl font-bold text-accent mb-2">Streak Earned!</h2>
        <p className="text-foreground mb-2">
          You completed 10 minutes of coaching!
        </p>
        <p className="text-muted-foreground text-sm mb-6">
          Great work! Your consistency is building amazing habits.
        </p>

        <div className="bg-accent/20 rounded-lg p-4 mb-6 border border-accent">
          <p className="text-2xl font-bold text-accent">🔥 +1 Streak</p>
        </div>

        <Button
          onClick={onClose}
          className="w-full bg-accent hover:bg-accent/90 text-sidebar-primary-foreground font-bold py-6 text-lg"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
