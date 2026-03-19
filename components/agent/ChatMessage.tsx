'use client';

import { ChatMessage as IChatMessage } from '@/context/AgentContext';

interface ChatMessageProps {
  message: IChatMessage;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user';

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} fade-in`}
    >
      <div
        className={`max-w-xs px-4 py-2 rounded-2xl ${
          isUser
            ? 'bg-primary text-sidebar-primary-foreground rounded-br-none'
            : 'bg-input text-foreground rounded-bl-none border border-border'
        }`}
      >
        <p className="text-sm">{message.text}</p>
      </div>
    </div>
  );
}
