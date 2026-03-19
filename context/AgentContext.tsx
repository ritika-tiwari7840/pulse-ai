'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: number;
}

interface AgentContextType {
  messages: ChatMessage[];
  addMessage: (text: string, sender: 'user' | 'agent') => void;
  clearMessages: () => void;
  elapsedTime: number;
  setElapsedTime: (time: number) => void;
  isPaused: boolean;
  setIsPaused: (paused: boolean) => void;
  streakEarned: boolean;
  setStreakEarned: (earned: boolean) => void;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export function AgentProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [streakEarned, setStreakEarned] = useState(false);

  const addMessage = (text: string, sender: 'user' | 'agent') => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <AgentContext.Provider
      value={{
        messages,
        addMessage,
        clearMessages,
        elapsedTime,
        setElapsedTime,
        isPaused,
        setIsPaused,
        streakEarned,
        setStreakEarned,
      }}
    >
      {children}
    </AgentContext.Provider>
  );
}

export function useAgent() {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error('useAgent must be used within AgentProvider');
  }
  return context;
}
