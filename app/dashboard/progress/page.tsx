'use client';

import { useDashboard } from '@/context/DashboardContext';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

export default function ProgressPage() {
  const { levels, currentStreak, bestStreak } = useDashboard();
  
  const completedDays = levels.filter(l => l.completed).length;
  const totalStreak = levels.reduce((sum, l) => sum + l.streakCount, 0);

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Progress Dashboard</h1>
            <p className="text-muted-foreground mb-8">
              Track your fitness journey and achievements
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-card border border-border rounded-lg p-6">
                <p className="text-muted-foreground text-sm mb-2">Current Streak</p>
                <p className="text-4xl font-bold text-primary">{currentStreak}</p>
                <p className="text-xs text-muted-foreground mt-2">days</p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <p className="text-muted-foreground text-sm mb-2">Best Streak</p>
                <p className="text-4xl font-bold text-secondary">{bestStreak}</p>
                <p className="text-xs text-muted-foreground mt-2">days</p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <p className="text-muted-foreground text-sm mb-2">Days Completed</p>
                <p className="text-4xl font-bold text-accent">{completedDays}</p>
                <p className="text-xs text-muted-foreground mt-2">out of 30</p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <p className="text-muted-foreground text-sm mb-2">Total Streaks</p>
                <p className="text-4xl font-bold">🔥 {totalStreak}</p>
                <p className="text-xs text-muted-foreground mt-2">earned</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-card border border-border rounded-lg p-6 mb-8">
              <h2 className="text-lg font-bold text-foreground mb-4">Monthly Progress</h2>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Completion Rate</span>
                    <span className="text-sm font-bold text-primary">
                      {Math.round((completedDays / 30) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-input rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                      style={{ width: `${(completedDays / 30) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Stats */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-bold text-foreground mb-4">Activity Timeline</h2>
              <div className="space-y-2">
                {levels.map((level) => (
                  <div key={level.day} className="flex items-center justify-between p-2 hover:bg-input rounded">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-muted-foreground">Day {level.day}</span>
                      {level.completed && (
                        <span className="text-xl">✓</span>
                      )}
                    </div>
                    {level.streakCount > 0 && (
                      <span className="text-sm text-accent font-bold">🔥 +{level.streakCount}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
