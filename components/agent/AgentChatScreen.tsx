'use client';

import { useRef, useEffect, useState } from 'react';
import { useAgent } from '@/context/AgentContext';
import { useAgentTimer } from '@/hooks/useAgentTimer';
import TimerDisplay from './TimerDisplay';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { Button } from '@/components/ui/button';

interface AgentChatScreenProps {
  onExit: () => void;
}

export default function AgentChatScreen({ onExit }: AgentChatScreenProps) {
  const { messages, addMessage, isPaused, setIsPaused } = useAgent();
  const { minutes, seconds, hasEarnedStreak, isPaused: isTimerPaused, pause, resume, timeRemaining } = useAgentTimer();
  const [inputValue, setInputValue] = useState('');
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    addMessage(text, 'user');
    setInputValue('');
    setIsLoadingResponse(true);

    // Simulate AI response delay
    setTimeout(() => {
      const responses = [
        'That\'s great! Keep up the momentum. How are you feeling about your workout today?',
        'Excellent work! Tell me, what\'s your main fitness goal right now?',
        'I love your enthusiasm! Remember to focus on form over speed.',
        'You\'re doing amazing! Let\'s push a bit harder. Ready for the next challenge?',
        'Great input! This will definitely help us track your progress.',
        'I\'m here to support you every step of the way. What else would you like to know?',
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      addMessage(randomResponse, 'agent');
      setIsLoadingResponse(false);
    }, 500);
  };

  const handlePauseResume = () => {
    if (isTimerPaused) {
      resume();
    } else {
      pause();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-card flex flex-col">
      {/* Header with Timer and Controls */}
      <div className="bg-card border-b border-border p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">PulseAI Coach</h1>
            <p className="text-sm text-muted-foreground">
              {hasEarnedStreak ? '✓ Streak Earned!' : `Continue for ${Math.ceil(timeRemaining / 60)} more minutes`}
            </p>
          </div>
          <TimerDisplay minutes={minutes} seconds={seconds} hasEarned={hasEarnedStreak} />
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col">
        <div className="max-w-4xl mx-auto w-full flex-1">
          {messages.length === 0 && (
            <div className="h-full flex items-center justify-center text-center">
              <div>
                <div className="text-6xl mb-4">👋</div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Welcome to Your Training Session
                </h2>
                <p className="text-muted-foreground max-w-md">
                  I'm here to guide you through your personalized workout. Ask me anything about fitness,
                  nutrition, or your health goals!
                </p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoadingResponse && (
              <div className="flex justify-start">
                <div className="bg-input rounded-2xl rounded-tl-none px-4 py-3 max-w-xs">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-card border-t border-border p-4">
        <div className="max-w-4xl mx-auto">
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSendMessage}
            disabled={isLoadingResponse || hasEarnedStreak}
            placeholder="Type your message..."
          />

          {/* Control Buttons */}
          <div className="flex gap-3 mt-4 justify-between">
            <Button
              onClick={handlePauseResume}
              variant="outline"
              className="flex-1 border-border hover:bg-input"
            >
              {isTimerPaused ? '▶ Resume' : '⏸ Pause'}
            </Button>
            <Button
              onClick={onExit}
              variant="outline"
              className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
            >
              ✕ Exit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
