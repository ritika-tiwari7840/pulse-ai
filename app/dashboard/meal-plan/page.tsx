'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

export default function MealPlanPage() {
  const [mealData, setMealData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        const survey = localStorage.getItem('pulseai_survey');

        if (!survey) {
          console.error("No survey data found");
          return;
        }

        const parsedSurvey = JSON.parse(survey);

        setLoading(true);

        const res = await fetch('http://127.0.0.1:8000/meal-plan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(parsedSurvey),
        });

        if (!res.ok) {
          throw new Error("Failed to fetch meal plan");
        }

        const data = await res.json();
        console.log("Meal API Response:", data);

        setMealData(data);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMealPlan();
  }, []);

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">

            <h1 className="text-3xl font-bold mb-2">Meal Plan</h1>
            <p className="text-muted-foreground mb-8">
              Your personalized nutrition guide
            </p>

            {/* 🔄 LOADING */}
            {loading && <p>Loading meal plan...</p>}

            {/* ❌ NO DATA */}
            {!loading && !mealData && (
              <p className="text-red-500">No meal plan available</p>
            )}

            {/* ✅ MEAL DATA */}
            {mealData && (
              <>
                <div className="mb-6 p-4 border rounded-lg">
                  <p><b>User:</b> {mealData.user}</p>
                  <p><b>Target Calories:</b> {mealData.target_calories}</p>
                  <p><b>Total Calories:</b> {mealData.total_calories}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mealData.meals.map((meal: any, index: number) => (
                    <div
                      key={index}
                      className="bg-card border border-border rounded-lg p-4 hover:border-primary transition-colors"
                    >
                      <h3 className="font-semibold text-foreground mb-2">
                        {meal.name}
                      </h3>

                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          Calories
                        </p>
                        <p className="text-lg font-bold text-primary">
                          {meal.calories}
                        </p>
                      </div>
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