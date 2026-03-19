'use client';

import { useState } from 'react';
import { useOnboarding, OnboardingData } from '@/context/OnboardingContext';
import BasicInfoStep from './steps/BasicInfoStep';
import FitnessGoalsStep from './steps/FitnessGoalsStep';
import HealthConditionsStep from './steps/HealthConditionsStep';
import WeightStep from './steps/WeightStep';
import ActivityLevelStep from './steps/ActivityLevelStep';
import DietaryPreferencesStep from './steps/DietaryPreferencesStep';
import HealthIssuesStep from './steps/HealthIssuesStep';
import ReviewStep from './steps/ReviewStep';
import ProgressIndicator from './ProgressIndicator';
import { Button } from '@/components/ui/button';

interface OnboardingContainerProps {
  onComplete: (data: Partial<OnboardingData>) => void;
}

const TOTAL_STEPS = 8;

const steps = [
  { title: 'Basic Info', component: BasicInfoStep },
  { title: 'Fitness Goals', component: FitnessGoalsStep },
  { title: 'Health Conditions', component: HealthConditionsStep },
  { title: 'Weight Info', component: WeightStep },
  { title: 'Activity Level', component: ActivityLevelStep },
  { title: 'Dietary Preferences', component: DietaryPreferencesStep },
  { title: 'Health Issues', component: HealthIssuesStep },
  { title: 'Review', component: ReviewStep },
];

export default function OnboardingContainer({ onComplete }: OnboardingContainerProps) {
  const { step, setStep, data, updateData } = useOnboarding();
  const [isLoading, setIsLoading] = useState(false);

  const CurrentStepComponent = steps[step].component;

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    await onComplete(data);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-card flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">PulseAI</h1>
          <p className="text-muted-foreground">Your Personal AI Health Coach</p>
        </div>

        {/* Progress Indicator */}
        <ProgressIndicator current={step + 1} total={TOTAL_STEPS} />

        {/* Step Content */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl my-8 slide-up">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground">{steps[step].title}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Step {step + 1} of {TOTAL_STEPS}
            </p>
          </div>

          <CurrentStepComponent
            data={data}
            onUpdate={updateData}
            onNext={handleNext}
          />
        </div>

        {/* Navigation */}
        <div className="flex gap-4 justify-between">
          <Button
            onClick={handlePrevious}
            disabled={step === 0}
            variant="outline"
            className="flex-1"
          >
            Previous
          </Button>

          {step === TOTAL_STEPS - 1 ? (
            <Button
              onClick={handleComplete}
              disabled={isLoading}
              className="flex-1 bg-accent hover:bg-accent/90"
            >
              {isLoading ? 'Submitting...' : 'Complete'}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
