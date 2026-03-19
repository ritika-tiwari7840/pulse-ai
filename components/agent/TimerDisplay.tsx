interface TimerDisplayProps {
  minutes: number;
  seconds: number;
  hasEarned: boolean;
}

export default function TimerDisplay({
  minutes,
  seconds,
  hasEarned,
}: TimerDisplayProps) {
  const displaySeconds = String(seconds).padStart(2, '0');
  const displayMinutes = String(minutes).padStart(2, '0');

  return (
    <div
      className={`
        rounded-xl px-6 py-3 font-mono text-3xl font-bold
        ${
          hasEarned
            ? 'bg-gradient-to-r from-accent to-secondary text-sidebar-primary-foreground shadow-lg'
            : 'bg-input text-primary border-2 border-primary pulse-glow'
        }
      `}
    >
      {displayMinutes}:{displaySeconds}
    </div>
  );
}
