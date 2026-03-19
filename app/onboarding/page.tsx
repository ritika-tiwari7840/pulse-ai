'use client';

import { useRouter } from 'next/navigation';
import { useOnboarding, OnboardingData } from '@/context/OnboardingContext';
import OnboardingContainer from '@/components/onboarding/OnboardingContainer';

export default function OnboardingPage() {
  const router = useRouter();
  const { data } = useOnboarding();

  const handleComplete = async (formData: Partial<OnboardingData>) => {
    try {
              localStorage.setItem('pulseai_survey', JSON.stringify(formData));

      const response = await fetch('http://127.0.0.1:8000/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();

        console.log("Backend JSON:", result);

        // ✅ SAVE PLAN
        localStorage.setItem('pulseai_plan', JSON.stringify(result.response));

        // ✅ mark onboarding done
        localStorage.setItem('pulseai_onboarding_complete', 'true');

        router.push('/dashboard');
      } else {
        console.error('Failed to submit onboarding data');
      }
    } catch (error) {
      console.error('Error submitting onboarding:', error);
    }
  };

  return <OnboardingContainer onComplete={handleComplete} />;
}