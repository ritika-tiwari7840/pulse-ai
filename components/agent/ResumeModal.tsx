'use client';

import { Button } from '@/components/ui/button';

interface ResumeModalProps {
  onResume: () => void;
  onExit: () => void;
}

export default function ResumeModal({ onResume, onExit }: ResumeModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-card border-2 border-border rounded-2xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-foreground mb-2">Not Enough Time</h2>
        <p className="text-muted-foreground mb-6">
          You need to chat for at least 10 minutes to earn your streak. You're making progress though!
        </p>

        <div className="bg-input border border-border rounded-lg p-4 mb-6">
          <p className="text-sm text-muted-foreground mb-1">Remember:</p>
          <p className="text-foreground font-medium">
            Your time will pause when you exit, and resume when you come back!
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onExit}
            variant="outline"
            className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
          >
            Exit (No Streak)
          </Button>
          <Button
            onClick={onResume}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
