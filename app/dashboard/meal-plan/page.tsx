'use client';

import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

export default function MealPlanPage() {
  const mealPlans = [
    { id: 1, name: 'Monday Breakfast', calories: 450 },
    { id: 2, name: 'Monday Lunch', calories: 650 },
    { id: 3, name: 'Monday Dinner', calories: 550 },
    { id: 4, name: 'Tuesday Breakfast', calories: 450 },
    { id: 5, name: 'Tuesday Lunch', calories: 650 },
    { id: 6, name: 'Tuesday Dinner', calories: 550 },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Meal Plan</h1>
            <p className="text-muted-foreground mb-8">
              Your personalized nutrition guide for the week
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mealPlans.map((meal) => (
                <div
                  key={meal.id}
                  className="bg-card border border-border rounded-lg p-4 hover:border-primary transition-colors"
                >
                  <h3 className="font-semibold text-foreground mb-2">{meal.name}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Calories</p>
                    <p className="text-lg font-bold text-primary">{meal.calories}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-card border border-border rounded-lg">
              <h2 className="text-xl font-bold text-foreground mb-4">Coming Soon</h2>
              <p className="text-muted-foreground">
                Detailed meal plans and nutrition tracking will be available soon. Your PulseAI coach
                will provide personalized recommendations based on your profile.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
