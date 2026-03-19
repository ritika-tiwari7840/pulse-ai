'use client';

import { OnboardingData } from '@/context/OnboardingContext';

interface ActivityLevelStepProps {
  data: Partial<OnboardingData>;
  onUpdate: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
}

const activityLevels = [
  {
    id: 'sedentary',
    label: 'Sedentary',
    description: 'Little or no exercise',
  },
  {
    id: 'light',
    label: 'Light Activity',
    description: 'Light exercise 1-3 days a week',
  },
  {
    id: 'moderate',
    label: 'Moderate Activity',
    description: 'Moderate exercise 3-5 days a week',
  },
  {
    id: 'very_active',
    label: 'Very Active',
    description: 'Intense exercise 6-7 days a week',
  },
];

export default function ActivityLevelStep({
  data,
  onUpdate,
}: ActivityLevelStepProps) {
  const selectedLevel = data.activityLevel;

  const handleSelect = (level: 'sedentary' | 'light' | 'moderate' | 'very_active') => {
    onUpdate({ activityLevel: level });
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        What's your typical activity level?
      </p>

      <div className="space-y-3">
        {activityLevels.map((level) => (
          <div
            key={level.id}
            onClick={() => handleSelect(level.id as any)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedLevel === level.id
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedLevel === level.id
                    ? 'border-primary bg-primary'
                    : 'border-muted-foreground'
                }`}
              >
                {selectedLevel === level.id && (
                  <div className="w-2 h-2 bg-background rounded-full" />
                )}
              </div>
              <div>
                <p className="font-medium text-foreground">{level.label}</p>
                <p className="text-xs text-muted-foreground">{level.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!selectedLevel && (
        <p className="text-sm text-destructive">Please select your activity level</p>
      )}
    </div>
  );
}
