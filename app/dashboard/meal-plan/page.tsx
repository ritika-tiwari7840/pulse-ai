'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

// ✅ Types
type Meal = {
  name: string;
  calories: number;
};

type MealPlan = {
  meals: Meal[];
  target_calories: number;
  total_calories: number;
};

type MealData = {
  success: boolean;
  user: string;
  meal_plan: MealPlan;
};

export default function MealPlanPage() {
  const router = useRouter();
  const [mealData, setMealData] = useState<MealData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // ✅ Prevent double API calls (Strict Mode fix)
  const hasFetched = useRef(false);

  useEffect(() => {
    const onboarded = localStorage.getItem('pulseai_onboarding_complete');
    if (!onboarded) {
      router.replace('/onboarding');
      return;
    } else {
      setIsReady(true);
    }

    const fetchMealPlan = async () => {
      try {
        // 🔥 1. Check cache first (Stale-While-Revalidate)
        const cached = localStorage.getItem('pulseai_meal_plan');
        if (cached) {
          setMealData(JSON.parse(cached));
        }

        // 🔥 2. Get survey
        const survey = localStorage.getItem('pulseai_survey');
        if (!survey) {
          console.error('No survey data found');
          toast.error("No survey data found.");
          return;
        }

        setLoading(true);

        // 🔥 3. API call
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
        const res = await fetch(`${apiUrl}/meal-plan`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: survey,
        });

        if (!res.ok) {
          throw new Error('Failed to fetch meal plan');
        }

        const data: MealData = await res.json();
        console.log('Meal API Response:', data);

        // 🔥 4. Save to cache
        localStorage.setItem('pulseai_meal_plan', JSON.stringify(data));

        setMealData(data);
      } catch (err) {
        console.error(err);
        const cached = localStorage.getItem('pulseai_meal_plan');
        if (!cached) {
          toast.error('Failed to load meal plan');
        } else {
          toast.warning('Network error: Showing saved meal plan', { id: 'offline' });
        }
      } finally {
        setLoading(false);
      }
    };

    // ✅ Strict mode guard
    if (hasFetched.current) return;
    hasFetched.current = true;

    fetchMealPlan();
  }, []);

  const mealsArray = mealData?.meal_plan?.meals || [];

  // 🔄 Regenerate handler
  const handleRegenerate = () => {
    localStorage.removeItem('pulseai_meal_plan');
    hasFetched.current = false;
    window.location.reload();
  };

  if (!isReady) return null;

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-3xl font-bold">Meal Plan</h1>

              {/* 🔄 Regenerate Button */}
              <button
                onClick={handleRegenerate}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90"
              >
                Regenerate
              </button>
            </div>

            <p className="text-muted-foreground mb-8">
              Your personalized nutrition guide
            </p>

            {/* 🔄 LOADING */}
            {loading && <p>Loading meal plan...</p>}

            {/* ❌ NO DATA */}
            {!loading && !mealData && (
              <p className="text-red-500">No meal plan available</p>
            )}

            {/* ✅ DATA */}
            {mealData && (
              <>
                {/* USER INFO */}
                <div className="mb-6 p-4 border rounded-lg">
                  <p><b>User:</b> {mealData.user}</p>
                  <p><b>Target Calories:</b> {mealData.meal_plan.target_calories}</p>
                  <p><b>Total Calories:</b> {mealData.meal_plan.total_calories}</p>
                </div>

                {/* MEALS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mealsArray.map((meal, index) => (
                    <div
                      key={index}
                      className="bg-card border border-border rounded-lg p-4 hover:border-primary transition-colors"
                    >
                      <h3 className="font-semibold text-foreground mb-2">
                        {meal.name}
                      </h3>

                      <p className="text-primary text-sm">
                        {meal.calories} kcal
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}