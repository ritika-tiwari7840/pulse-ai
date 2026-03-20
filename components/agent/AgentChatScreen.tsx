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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text) return;

    addMessage(text, 'user');
    setInput('');

    setTimeout(() => {
      addMessage("Nice! Keep going 💪", 'agent');
    }, 500);
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
        {/* WORKOUT PANEL - Scrollable independently */}
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

        {/* CHAT PANEL - Takes remaining space */}
        <div className="flex-1 flex flex-col min-w-0 bg-background relative">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t bg-card">
            <ChatInput value={input} onChange={setInput} onSend={sendMessage} />
            <div className="mt-2 flex justify-end">
              <Button variant="ghost" size="sm" onClick={onExit} className="text-muted-foreground hover:text-foreground">
                Exit Session
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}