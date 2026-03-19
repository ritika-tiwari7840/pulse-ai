'use client';

import { OnboardingData } from '@/context/OnboardingContext';
import { Input } from '@/components/ui/input';

interface WeightStepProps {
  data: Partial<OnboardingData>;
  onUpdate: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
}

export default function WeightStep({
  data,
  onUpdate,
}: WeightStepProps) {
  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const weight = parseFloat(e.target.value) || 0;
    onUpdate({ weight });
  };

  const handleTargetWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetWeight = parseFloat(e.target.value) || 0;
    onUpdate({ targetWeight });
  };

  const isValid = data.weight && data.weight > 0 && data.targetWeight && data.targetWeight > 0;

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Current Weight (kg)
        </label>
        <Input
          type="number"
          placeholder="Enter your current weight"
          value={data.weight || ''}
          onChange={handleWeightChange}
          className="bg-input border-border text-foreground"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Target Weight (kg)
        </label>
        <Input
          type="number"
          placeholder="Enter your target weight"
          value={data.targetWeight || ''}
          onChange={handleTargetWeightChange}
          className="bg-input border-border text-foreground"
        />
      </div>

      <p className="text-sm text-muted-foreground">
        These metrics help us personalize your fitness plan.
      </p>

      {!isValid && (
        <p className="text-sm text-destructive">Please enter valid weight values</p>
      )}
    </div>
  );
}
