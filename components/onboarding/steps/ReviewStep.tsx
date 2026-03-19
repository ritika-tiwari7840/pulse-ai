'use client';

import { OnboardingData } from '@/context/OnboardingContext';

interface ReviewStepProps {
  data: Partial<OnboardingData>;
  onUpdate: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
}

export default function ReviewStep({
  data,
}: ReviewStepProps) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Here's a summary of your information. You can go back to edit any section if needed.
      </p>

      <div className="space-y-4">
        <div className="p-4 bg-input rounded-lg border border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Name</p>
          <p className="text-foreground font-medium">{data.name || 'Not provided'}</p>
        </div>

        <div className="p-4 bg-input rounded-lg border border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Age</p>
          <p className="text-foreground font-medium">{data.age || 'Not provided'} years</p>
        </div>

        <div className="p-4 bg-input rounded-lg border border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Weight</p>
          <p className="text-foreground font-medium">
            {data.weight || 'Not provided'} kg → {data.targetWeight || 'Not provided'} kg
          </p>
        </div>

        <div className="p-4 bg-input rounded-lg border border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Activity Level</p>
          <p className="text-foreground font-medium capitalize">
            {data.activityLevel?.replace(/_/g, ' ') || 'Not provided'}
          </p>
        </div>

        <div className="p-4 bg-input rounded-lg border border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Fitness Goals</p>
          <p className="text-foreground font-medium">
            {data.fitnessGoals && data.fitnessGoals.length > 0
              ? data.fitnessGoals.join(', ')
              : 'Not provided'}
          </p>
        </div>

        <div className="p-4 bg-input rounded-lg border border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Health Conditions</p>
          <p className="text-foreground font-medium">
            {data.healthConditions && data.healthConditions.length > 0
              ? data.healthConditions.join(', ')
              : 'No conditions'}
          </p>
        </div>

        <div className="p-4 bg-input rounded-lg border border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Dietary Preferences</p>
          <p className="text-foreground font-medium">
            {data.dietaryPreferences && data.dietaryPreferences.length > 0
              ? data.dietaryPreferences.join(', ')
              : 'No restrictions'}
          </p>
        </div>

        {data.healthIssues && (
          <div className="p-4 bg-input rounded-lg border border-border">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Health Issues</p>
            <p className="text-foreground font-medium">{data.healthIssues}</p>
          </div>
        )}
      </div>

      <div className="p-4 bg-primary/10 border border-primary rounded-lg">
        <p className="text-sm text-primary">
          Click "Complete" to submit your information and start your personalized fitness journey!
        </p>
      </div>
    </div>
  );
}
