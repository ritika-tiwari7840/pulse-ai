'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDashboard } from '@/context/DashboardContext';
import { useAgent } from '@/context/AgentContext';
import AgentChatScreen from '@/components/agent/AgentChatScreen';
import StreakEarnedModal from '@/components/agent/StreakEarnedModal';
import ResumeModal from '@/components/agent/ResumeModal';

export default function AgentPage() {
  const router = useRouter();
  const { currentDay, updateLevel } = useDashboard();
  const { elapsedTime, setStreakEarned, streakEarned, clearMessages } = useAgent();
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);

  useEffect(() => {
    if (!currentDay) {
      router.push('/dashboard');
    } else {
      // Start fresh chat for this day
      clearMessages();
    }
  }, [currentDay]);

  // Show streak modal when earned
  useEffect(() => {
    if (streakEarned) {
      setShowStreakModal(true);
    }
  }, [streakEarned]);

  const handleExit = () => {
    const TARGET_SECONDS = 10 * 60;
    if (elapsedTime < TARGET_SECONDS) {
      setShowResumeModal(true);
    } else {
      completeDay();
    }
  };

  const completeDay = () => {
    const TARGET_SECONDS = 10 * 60;
    if (currentDay && elapsedTime >= TARGET_SECONDS) {
      updateLevel(currentDay, {
        completed: true,
        streakCount: 1,
        lastCompletedDate: new Date().toISOString(),
      });
    }
    router.push('/dashboard');
  };

  const handleResumeNo = () => {
    setShowResumeModal(false);
    router.push('/dashboard');
  };

  const handleStreakModalClose = () => {
    setShowStreakModal(false);
    completeDay();
  };

  return (
    <>
      <AgentChatScreen onExit={handleExit} />
      {showStreakModal && (
        <StreakEarnedModal onClose={handleStreakModalClose} />
      )}
      {showResumeModal && (
        <ResumeModal onResume={() => setShowResumeModal(false)} onExit={handleResumeNo} />
      )}
    </>
  );
}
