'use client';

import { useRouter } from 'next/navigation';
import { useDashboard } from '@/context/DashboardContext';
import DayLevel from './DayLevel';

export default function LevelGrid() {
  const router = useRouter();
  const { levels, setCurrentDay } = useDashboard();

  const handleLevelClick = (day: number) => {
    setCurrentDay(day);
    router.push('/dashboard/agent');
  };

  // Create grid with 6 columns (will be responsive)
  const gridCols = 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6';

  return (
    <div className={`grid ${gridCols} gap-4`}>
      {levels.map((level) => (
        <div
          key={level.day}
          onClick={() => handleLevelClick(level.day)}
          className="cursor-pointer"
        >
          <DayLevel level={level} />
        </div>
      ))}
    </div>
  );
}
