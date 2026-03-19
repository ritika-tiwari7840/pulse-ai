'use client';

import { OnboardingData } from '@/context/OnboardingContext';
import { Checkbox } from '@/components/ui/checkbox';

interface FitnessGoalsStepProps {
  data: Partial<OnboardingData>;
  onUpdate: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
}

const fitnessGoalsOptions = [
  { id: 'weight-loss', label: 'Weight Loss' },
  { id: 'muscle-gain', label: 'Muscle Gain' },
  { id: 'endurance', label: 'Endurance' },
  { id: 'flexibility', label: 'Flexibility' },
  { id: 'strength', label: 'Strength' },
  { id: 'general-fitness', label: 'General Fitness' },
];

export default function FitnessGoalsStep({
  data,
  onUpdate,
}: FitnessGoalsStepProps) {
  const goals = data.fitnessGoals || [];

  const handleGoalToggle = (goalId: string) => {
    const updated = goals.includes(goalId)
      ? goals.filter((g) => g !== goalId)
      : [...goals, goalId];
    onUpdate({ fitnessGoals: updated });
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Select your fitness goals. You can choose multiple options.
      </p>

      <div className="space-y-3">
        {fitnessGoalsOptions.map((option) => (
          <div
            key={option.id}
            className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:border-primary cursor-pointer transition-colors"
            onClick={() => handleGoalToggle(option.id)}
          >
            <Checkbox
              checked={goals.includes(option.id)}
              onCheckedChange={() => handleGoalToggle(option.id)}
            />
            <label className="text-foreground cursor-pointer flex-1">
              {option.label}
            </label>
          </div>
        ))}
      </div>

      {goals.length === 0 && (
        <p className="text-sm text-destructive">Please select at least one goal</p>
      )}
    </div>
  );
}
