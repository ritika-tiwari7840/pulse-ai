'use client';

import { OnboardingData } from '@/context/OnboardingContext';
import { Checkbox } from '@/components/ui/checkbox';

interface DietaryPreferencesStepProps {
  data: Partial<OnboardingData>;
  onUpdate: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
}

const dietaryOptions = [
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'keto', label: 'Keto' },
  { id: 'gluten-free', label: 'Gluten-Free' },
  { id: 'dairy-free', label: 'Dairy-Free' },
  { id: 'paleo', label: 'Paleo' },
  { id: 'none', label: 'No restrictions' },
];

export default function DietaryPreferencesStep({
  data,
  onUpdate,
}: DietaryPreferencesStepProps) {
  const preferences = data.dietaryPreferences || [];

  const handlePreferenceToggle = (prefId: string) => {
    if (prefId === 'none') {
      onUpdate({ dietaryPreferences: preferences.includes('none') ? [] : ['none'] });
      return;
    }

    let updated = preferences.includes(prefId)
      ? preferences.filter((p) => p !== prefId)
      : [...preferences.filter((p) => p !== 'none'), prefId];

    onUpdate({ dietaryPreferences: updated });
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Do you have any dietary preferences or restrictions?
      </p>

      <div className="space-y-3">
        {dietaryOptions.map((option) => (
          <div
            key={option.id}
            className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:border-primary cursor-pointer transition-colors"
            onClick={() => handlePreferenceToggle(option.id)}
          >
            <Checkbox
              checked={preferences.includes(option.id)}
              onCheckedChange={() => handlePreferenceToggle(option.id)}
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
