'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDashboard } from '@/context/DashboardContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { currentStreak } = useDashboard();

  const navItems = [
    { href: '/dashboard', label: 'Home' },
    { href: '/dashboard/meal-plan', label: 'Meal Plan' },
    { href: '/dashboard/progress', label: 'Progress' },
      { href: '/dashboard/ai-coach', label: 'AI Coach' },  
  ];

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-2xl font-bold text-sidebar-primary">PulseAI</h1>
        <p className="text-xs text-sidebar-accent mt-1">Health Coach</p>
      </div>

      {/* Streak Counter */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="bg-sidebar-accent/20 border border-sidebar-accent rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-sidebar-foreground">Current Streak</span>
            <span className="text-2xl">🔥</span>
          </div>
          <p className="text-3xl font-bold text-sidebar-accent">{currentStreak}</p>
          <p className="text-xs text-sidebar-foreground/70 mt-1">days</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <div className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/20'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border text-center">
        <p className="text-xs text-sidebar-foreground/70">
          Keep up the great work!
        </p>
      </div>
    </div>
  );
}
