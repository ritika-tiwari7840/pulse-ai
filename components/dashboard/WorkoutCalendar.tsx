'use client';

import { useEffect, useState } from 'react';

interface Props {
  onSelectDate: (date: string) => void;
}

export default function WorkoutCalendar({ onSelectDate }: Props) {
  const [today, setToday] = useState<string>("");

  useEffect(() => {
    // ✅ FIX: use local date instead of UTC
    setToday(new Date().toLocaleDateString('en-CA'));
  }, []);

  const getDates = () => {
    const dates: string[] = [];
    const now = new Date();

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(now.getDate() - i);

      // ✅ FIX HERE ALSO
      dates.push(d.toLocaleDateString('en-CA'));
    }

    return dates.reverse();
  };
const isCompleted = (date: string) =>
    localStorage.getItem(`completed_${date}`) === 'true';


  return (
    <div className="grid grid-cols-7 gap-3">
           {getDates().map((date) => {
        const isToday = date === today;
        const isFuture = date > today;
        const isPast = date < today;
        const completed = isCompleted(date); // ✅ IMPORTANT


        return (
          <div
            key={date}
            onClick={() => {
              if (!isFuture) onSelectDate(date);
            }}
            className={`p-4 text-center rounded-lg border cursor-pointer
              ${isToday ? 'bg-primary text-white' : ''}
              ${isFuture ? 'opacity-40 cursor-not-allowed' : 'hover:bg-muted'}
            `}
          >
            <p className="text-sm font-bold">
              {date.split('-')[2]}
            </p>
 <p className="text-xs">
              {isFuture && 'Locked'}
              {isPast && !completed && 'Missed'}
              {completed && '✔ Done'}
            </p>
            <p className="text-xs">
              {isToday ? 'Today' : ''}
            </p>
          </div>
        );
      })}
    </div>
  );
}