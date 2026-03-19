'use client';

import { OnboardingData } from '@/context/OnboardingContext';
import { Input } from '@/components/ui/input';

interface BasicInfoStepProps {
  data: Partial<OnboardingData>;
  onUpdate: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
}

export default function BasicInfoStep({
  data,
  onUpdate,
  onNext,
}: BasicInfoStepProps) {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ name: e.target.value });
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const age = parseInt(e.target.value) || 0;
    onUpdate({ age });
  };

  const isValid = data.name && data.age && data.age > 0;

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Name
        </label>
        <Input
          type="text"
          placeholder="Enter your name"
          value={data.name || ''}
          onChange={handleNameChange}
          className="bg-input border-border text-foreground"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Age
        </label>
        <Input
          type="number"
          placeholder="Enter your age"
          value={data.age || ''}
          onChange={handleAgeChange}
          className="bg-input border-border text-foreground"
        />
      </div>

      <p className="text-sm text-muted-foreground">
        We need your basic information to get started. Let's begin your fitness journey!
      </p>
    </div>
  );
}
