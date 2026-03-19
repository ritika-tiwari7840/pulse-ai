'use client';

import { useRouter } from 'next/navigation';
import { useOnboarding, OnboardingData } from '@/context/OnboardingContext';
import OnboardingContainer from '@/components/onboarding/OnboardingContainer';

export default function OnboardingPage() {
  const router = useRouter();
  const { data } = useOnboarding();

  const handleComplete = async (formData: Partial<OnboardingData>) => {
    try {
      // Submit to backend API
      const response = await fetch('http://127.0.0.1:8000/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      console.log(formData);
      if (response.ok) {
        // Mark onboarding as complete
const data = await response.json();

console.log("Backend JSON:", data);     
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
