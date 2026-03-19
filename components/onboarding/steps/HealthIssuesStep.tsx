'use client';

import { OnboardingData } from '@/context/OnboardingContext';
import { Textarea as TextAreaComponent } from '@/components/ui/textarea';

function Textarea(props: React.ComponentProps<typeof TextAreaComponent>) {
  return <TextAreaComponent {...props} />;
}

interface HealthIssuesStepProps {
  data: Partial<OnboardingData>;
  onUpdate: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
}

export default function HealthIssuesStep({
  data,
  onUpdate,
}: HealthIssuesStepProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ healthIssues: e.target.value });
  };

  return (
    <div className="space-y-6">
      <label className="block text-sm font-medium text-foreground">
        Any other health issues or concerns? (Optional)
      </label>
      <Textarea
        placeholder="Tell us about any injuries, pain, or other health concerns that might affect your training..."
        value={data.healthIssues || ''}
        onChange={handleChange}
        className="bg-input border-border text-foreground min-h-32 resize-none"
      />

      <p className="text-sm text-muted-foreground">
        This information helps us create a safer and more personalized workout plan for you.
      </p>
    </div>
  );
}
