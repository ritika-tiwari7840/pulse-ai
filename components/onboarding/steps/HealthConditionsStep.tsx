'use client';

import { OnboardingData } from '@/context/OnboardingContext';
import { Checkbox } from '@/components/ui/checkbox';

interface HealthConditionsStepProps {
  data: Partial<OnboardingData>;
  onUpdate: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
}

const healthConditionsOptions = [
  { id: 'none', label: 'No health conditions' },
  { id: 'diabetes', label: 'Diabetes' },
  { id: 'hypertension', label: 'Hypertension' },
  { id: 'arthritis', label: 'Arthritis' },
  { id: 'asthma', label: 'Asthma' },
  { id: 'heart-disease', label: 'Heart Disease' },
  { id: 'back-pain', label: 'Back Pain' },
  { id: 'knee-issues', label: 'Knee Issues' },
];

export default function HealthConditionsStep({
  data,
  onUpdate,
}: HealthConditionsStepProps) {
  const conditions = data.healthConditions || [];

  const handleConditionToggle = (conditionId: string) => {
    // If "none" is selected, clear other selections
    if (conditionId === 'none') {
      onUpdate({ healthConditions: conditions.includes('none') ? [] : ['none'] });
      return;
    }

    // Remove "none" if other conditions are selected
    let updated = conditions.includes(conditionId)
      ? conditions.filter((c) => c !== conditionId)
      : [...conditions.filter((c) => c !== 'none'), conditionId];

    onUpdate({ healthConditions: updated });
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Do you have any health conditions we should know about? Select all that apply.
      </p>

      <div className="space-y-3">
        {healthConditionsOptions.map((option) => (
          <div
            key={option.id}
            className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:border-primary cursor-pointer transition-colors"
            onClick={() => handleConditionToggle(option.id)}
          >
            <Checkbox
              checked={conditions.includes(option.id)}
              onCheckedChange={() => handleConditionToggle(option.id)}
            />
            <label className="text-foreground cursor-pointer flex-1">
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
