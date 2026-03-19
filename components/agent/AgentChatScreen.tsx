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
    <div className="flex flex-col h-screen">

      {/* HEADER */}
      <div className="p-4 border-b">
        <h1 className="font-bold">PulseAI</h1>
        <TimerDisplay minutes={minutes} seconds={seconds} hasEarned={false} />
      </div>

      {/* WORKOUT */}
      <div className="p-4">
        {!todayPlan ? (
          <p>Loading...</p>
        ) : todayPlan?.exercises?.length === 0 ? (
          <p>Rest Day 😌</p>
        ) : (
          <>
            <h2 className="font-bold">{planName}</h2>
            <p>{todayPlan.focus}</p>

            {todayPlan.exercises.map((ex: any, i: number) => (
              <div key={i} className="border p-2 my-2 rounded">
                <p>{ex.name}</p>
                <p>{ex.sets} x {ex.reps}</p>
              </div>
            ))}

            <Button onClick={markComplete}>Mark Complete</Button>
          </>
        )}
      </div>

      {/* CHAT */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="p-4 border-t">
        <ChatInput value={input} onChange={setInput} onSend={sendMessage} />
        <Button onClick={onExit}>Exit</Button>
      </div>
    </div>
  );
}