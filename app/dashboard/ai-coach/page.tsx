'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import WorkoutCalendar from '@/components/dashboard/WorkoutCalendar';

// 🔥 TYPES (important for stability)
type Issue = {
  timestamp_seconds: number;
  joint_or_body_part: string;
  observation: string;
  correction_cue: string;
  severity: 'critical' | 'moderate' | 'minor';
};

type Feedback = {
  exercise_detected: string;
  form_score: number;
  is_correct_form: boolean;
  suggested_regression: string;
  overall_summary: string;
  priority_correction: string;
  issues: Issue[];
  positive_observations: string[];
};

type ApiResponse = {
  success: boolean;
  feedback: Feedback;
};

export default function DashboardPage() {
  const router = useRouter();

  const [video, setVideo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const onboarded = localStorage.getItem('pulseai_onboarding_complete');
    if (!onboarded) {
      router.replace('/onboarding');
    } else {
      setIsReady(true);
    }

    // Load last analysis cache
    const lastData = localStorage.getItem('pulseai_last_analysis');
    if (lastData) {
      try {
        setResult(JSON.parse(lastData));
      } catch (err) {}
    }
  }, [router]);

  const handleDateSelect = (date: string) => {
    localStorage.setItem('selected_date', date);
    router.push('/dashboard/agent');
  };

  // 🔥 VIDEO UPLOAD
  const handleUpload = async () => {
    if (!video) {
      toast.error('Please upload a video first');
      return;
    }

    const formData = new FormData();
    formData.append('video', video);
    formData.append('exercise_hint', 'pushup');
    formData.append('perceived_difficulty', 'medium');

    try {
      setLoading(true);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const res = await fetch(`${apiUrl}/analyze-video`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to analyze video');
      }

      const data: ApiResponse = await res.json();
      console.log('AI Response:', data);

      localStorage.setItem('pulseai_last_analysis', JSON.stringify(data));
      setResult(data);
      toast.success('Analysis complete!');
    } catch (err) {
      console.error(err);
      const hasCache = !!localStorage.getItem('pulseai_last_analysis');
      if (hasCache) {
        toast.warning('Network error: Showing your previous analysis');
      } else {
        toast.error('Error analyzing video');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isReady) return null;

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <div className="p-6 overflow-auto">

          {/* WORKOUT CALENDAR */}
          <h1 className="text-2xl font-bold mb-4">
            Your Workout Calendar
          </h1>

          <WorkoutCalendar onSelectDate={handleDateSelect} />

          {/* AI COACH */}
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
            {result?.feedback && (
              <div className="mt-6 border p-4 rounded space-y-4">

                <h3 className="text-lg font-bold">AI Feedback</h3>

                {/* SCORE */}
                <p>
                  <b>Form Score:</b> {result.feedback.form_score}/10
                </p>

                {/* SUMMARY */}
                <p>
                  <b>Summary:</b> {result.feedback.overall_summary}
                </p>

                {/* PRIORITY */}
                <p className="text-red-500">
                  <b>Priority Fix:</b> {result.feedback.priority_correction}
                </p>

                {/* SUGGESTION */}
                <p>
                  <b>Suggested Exercise:</b>{' '}
                  {result.feedback.suggested_regression}
                </p>

                {/* ISSUES */}
                <div>
                  <h4 className="font-semibold mt-2">Key Issues:</h4>

                  {result.feedback.issues?.slice(0, 3).map((issue, index) => (
                    <div key={index} className="mt-2 p-3 border rounded">

                      <p>
                        <b>Part:</b> {issue.joint_or_body_part}
                      </p>

                      <p>
                        <b>Problem:</b> {issue.observation}
                      </p>

                      <p className="text-green-600">
                        <b>Fix:</b> {issue.correction_cue}
                      </p>

                      {/* 🔥 Severity */}
                      <p
                        className={
                          issue.severity === 'critical'
                            ? 'text-red-500'
                            : issue.severity === 'moderate'
                            ? 'text-yellow-500'
                            : 'text-green-500'
                        }
                      >
                        Severity: {issue.severity}
                      </p>

                    </div>
                  ))}
                </div>

                {/* POSITIVES */}
                <div>
                  <h4 className="font-semibold mt-2">
                    What You Did Well:
                  </h4>

                  {result.feedback.positive_observations?.map(
                    (point, index) => (
                      <p key={index}>✅ {point}</p>
                    )
                  )}
                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}