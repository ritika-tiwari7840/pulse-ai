'use client';

import { ChatMessage as IChatMessage } from '@/context/AgentContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
        className={`max-w-[85%] sm:max-w-[75%] px-4 py-3 rounded-2xl ${
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-none'
            : 'bg-muted/50 text-foreground rounded-bl-none border border-border/50'
        }`}
      >
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        ) : (
          <div className="text-sm prose-sm dark:prose-invert max-w-none space-y-2">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ node, ...props }) => <p className="mb-2 last:mb-0 whitespace-pre-wrap" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                li: ({ node, ...props }) => <li className="" {...props} />,
                h1: ({ node, ...props }) => <h1 className="text-lg font-bold mt-4 mb-2" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-base font-bold mt-3 mb-2" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-sm font-bold mt-2 mb-1" {...props} />,
                strong: ({ node, ...props }) => <strong className="font-semibold text-foreground" {...props} />,
                a: ({ node, ...props }) => <a className="text-primary hover:underline" target="_blank" rel="noreferrer" {...props} />,
                code({ node, inline, className, children, ...props }: any) {
                  return !inline ? (
                    <div className="bg-background/80 rounded-md p-3 my-2 overflow-x-auto border border-border/50">
                      <code className="text-xs font-mono" {...props}>
                        {children}
                      </code>
                    </div>
                  ) : (
                    <code className="bg-background/80 rounded px-1.5 py-0.5 text-xs font-mono border border-border/50" {...props}>
                      {children}
                    </code>
                  );
                },
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-l-2 border-primary/50 pl-4 italic text-muted-foreground my-2" {...props} />
                ),
              }}
            >
              {message.text}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
