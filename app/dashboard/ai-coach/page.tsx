'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import WorkoutCalendar from '@/components/dashboard/WorkoutCalendar';

export default function DashboardPage() {
  const router = useRouter();

  const [video, setVideo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const onboarded = localStorage.getItem('pulseai_onboarding_complete');
    if (!onboarded) {
      router.push('/onboarding');
    }
  }, [router]);

  const handleDateSelect = (date: string) => {
    localStorage.setItem('selected_date', date);
    router.push('/dashboard/agent');
  };

  // 🔥 AI COACH FUNCTION
  const handleUpload = async () => {
    if (!video) {
      alert('Please upload a video first');
      return;
    }

    const formData = new FormData();
    formData.append('file', video);

    try {
      setLoading(true);

      const res = await fetch('http://127.0.0.1:8000/analyze-video', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to analyze video');
      }

      const data = await res.json();
      setResult(data);

    } catch (err) {
      console.error(err);
      alert('Error analyzing video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <div className="p-6 overflow-auto">

          {/* 🔥 WORKOUT CALENDAR */}
          <h1 className="text-2xl font-bold mb-4">
            Your Workout Calendar
          </h1>

          <WorkoutCalendar onSelectDate={handleDateSelect} />

          {/* 🔥 AI COACH SECTION */}
          <div className="mt-10 border-t pt-6">
            <h2 className="text-xl font-bold mb-4">AI Coach 🎥</h2>

            {/* Upload */}
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideo(e.target.files?.[0] || null)}
              className="mb-3"
            />

            <button
              onClick={handleUpload}
              className="bg-primary text-white px-4 py-2 rounded"
            >
              {loading ? 'Analyzing...' : 'Upload & Analyze'}
            </button>

            {/* RESULT */}
            {result && (
              <div className="mt-6 border p-4 rounded">
                <h3 className="text-lg font-bold mb-2">AI Feedback</h3>

                <p><b>Score:</b> {result.score}</p>
                <p><b>Mistakes:</b> {result.mistakes}</p>
                <p><b>Suggestions:</b> {result.suggestions}</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}