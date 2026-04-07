'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useOnboarding, OnboardingData } from '@/context/OnboardingContext';
import OnboardingContainer from '@/components/onboarding/OnboardingContainer';

export default function OnboardingPage() {
  const router = useRouter();
  const { data } = useOnboarding();

  useEffect(() => {
    const token = localStorage.getItem('pulseai_user_token');
    if (!token) {
      router.replace('/login');
    }
  }, [router]);

  const handleComplete = async (formData: Partial<OnboardingData>) => {
    try {
              localStorage.setItem('pulseai_survey', JSON.stringify(formData));

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${apiUrl}/generate-plan`, {
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
        toast.error('Failed to submit onboarding data');
      }
    } catch (error) {
      console.error('Error submitting onboarding:', error);
      toast.error('Error submitting onboarding');
    }
  };

  const handleSkip = () => {
    localStorage.setItem('pulseai_onboarding_complete', 'true');
    router.push('/dashboard');
  };

  return <OnboardingContainer onComplete={handleComplete} onSkip={handleSkip} />;
}