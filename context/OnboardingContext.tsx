'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface OnboardingData {
  name: string;
  age: number;
  height: number;
  fitnessGoals: string[];
  healthConditions: string[];
  weight: number;
  targetWeight: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'very_active';
  dietaryPreferences: string[];
  healthIssues: string;
}

interface OnboardingContextType {
  step: number;
  setStep: (step: number) => void;
  data: Partial<OnboardingData>;
  updateData: (updates: Partial<OnboardingData>) => void;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Partial<OnboardingData>>({});

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const resetOnboarding = () => {
    setStep(0);
    setData({});
  };

  return (
    <OnboardingContext.Provider
      value={{ step, setStep, data, updateData, resetOnboarding }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
}
