'use client';

import { useRef, useEffect, useState } from 'react';
import { useAgent } from '@/context/AgentContext';
import { useAgentTimer } from '@/hooks/useAgentTimer';
import TimerDisplay from './TimerDisplay';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { Button } from '@/components/ui/button';

interface Props {
  onExit: () => void;
  todayPlan?: any;
  planName?: string;
}

export default function AgentChatScreen({
  onExit,
  todayPlan,
  planName,
}: Props) {
  const { messages, addMessage } = useAgent();
  const { minutes, seconds } = useAgentTimer();

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    // Add user message immediately
    addMessage(text, 'user');
    setInput('');
    setIsLoading(true);

    try {
      // Retrieve user profile from localStorage
      const surveyRaw = localStorage.getItem('pulseai_survey');
      const user = surveyRaw ? JSON.parse(surveyRaw) : {};

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const res = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user,
          message: text,
          todayPlan: todayPlan ?? null,
          planName: planName ?? '',
        }),
      });

      if (!res.ok) throw new Error('Chat API error');

      const data = await res.json();

      if (data.success && data.reply) {
        addMessage(data.reply, 'agent');
      } else if (data.success && data.data) {
        // Form analysis path
        addMessage(
          `Form Score: ${data.data.form_score}/10 — ${data.data.overall_summary}`,
          'agent'
        );
      } else {
        addMessage('Sorry, I could not generate a response right now. Try again!', 'agent');
      }
    } catch (err) {
      console.error('Chat error:', err);
      addMessage('Connection error. Make sure the PulseAI backend is running and try again.', 'agent');
    } finally {
      setIsLoading(false);
    }
  };

  const markComplete = () => {
    const today = new Date().toLocaleDateString('en-CA');
    localStorage.setItem(`completed_${today}`, 'true');
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      {/* HEADER */}
      <div className="p-4 border-b flex justify-between items-center bg-card z-10">
        <h1 className="font-bold text-xl text-primary">PulseAI</h1>
        <TimerDisplay minutes={minutes} seconds={seconds} hasEarned={false} />
      </div>

      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        {/* WORKOUT PANEL */}
        <div className="w-full md:w-80 lg:w-96 max-h-[35vh] md:max-h-none border-b md:border-b-0 md:border-r overflow-y-auto flex-shrink-0 bg-muted/10">
          <div className="p-4 space-y-4">
            {!todayPlan ? (
              <p className="text-muted-foreground animate-pulse">Loading plan...</p>
            ) : todayPlan?.exercises?.length === 0 ? (
              <div className="text-center py-10 bg-card rounded-lg border">
                <p className="text-3xl mb-2">😌</p>
                <p className="font-medium">Rest Day</p>
              </div>
            ) : (
              <>
                <div>
                  <h2 className="font-bold text-lg">{planName}</h2>
                  <p className="text-sm text-primary">{todayPlan.focus}</p>
                </div>

                <div className="space-y-2">
                  {todayPlan.exercises.map((ex: any, i: number) => (
                    <div key={i} className="border bg-card p-3 rounded-md shadow-sm">
                      <p className="font-semibold text-sm">{ex.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {ex.sets} sets × {ex.reps} reps
                      </p>
                    </div>
                  ))}
                </div>

                <Button onClick={markComplete} className="w-full mt-4">
                  Mark Complete
                </Button>
              </>
            )}
          </div>
        </div>

        {/* CHAT PANEL */}
        <div className="flex-1 flex flex-col min-w-0 bg-background relative">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground mt-10 space-y-2">
                <p className="text-2xl">💬</p>
                <p className="font-medium">Hey! I'm your AI Coach.</p>
                <p className="text-sm">Ask me anything about today's workout, form tips, or motivation!</p>
              </div>
            )}
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span>Coach is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t bg-card">
            <ChatInput
              value={input}
              onChange={setInput}
              onSend={sendMessage}
              disabled={isLoading}
              placeholder="Ask your AI coach anything..."
            />
            <div className="mt-2 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={onExit}
                className="text-muted-foreground hover:text-foreground"
              >
                Exit Session
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}