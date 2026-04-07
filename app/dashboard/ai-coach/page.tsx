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
    const token = localStorage.getItem('pulseai_user_token');
    if (!token) {
      router.replace('/login');
      return;
    }

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

            {/* Upload Area */}
            <div className="border-2 border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 transition-colors rounded-2xl p-8 mb-6 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden group">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-3xl text-primary">📤</span>
              </div>
              <h3 className="font-bold text-lg mb-2 text-foreground">Upload Workout Video</h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-sm">
                Select a video of your exercise to receive instant AI feedback on your form and technique.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideo(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    title="Select Video"
                  />
                  <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer w-full sm:w-auto">
                    {video ? <span className="truncate max-w-[200px] inline-block align-bottom">{video.name}</span> : 'Select Video'}
                  </button>
                </div>

                {video && (
                  <button
                    onClick={handleUpload}
                    disabled={loading}
                    className="bg-accent text-accent-foreground font-bold px-6 py-2.5 rounded-lg shadow-md hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto z-20 relative"
                  >
                    {loading ? 'Analyzing...' : 'Analyze Form 🔥'}
                  </button>
                )}
              </div>
            </div>

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