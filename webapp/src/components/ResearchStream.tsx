'use client';

import { type FC, useRef, useEffect } from 'react';
import { Message } from 'ai';
import { Card } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface ResearchStreamProps {
  messages: Message[];
  isLoading?: boolean;
  className?: string;
}

const ResearchStream: FC<ResearchStreamProps> = ({
  messages,
  isLoading = false,
  className = '',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Card className={cn('h-[600px] overflow-y-auto p-4', className)} ref={scrollRef}>
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            'mb-4 rounded-lg p-4',
            message.role === 'user'
              ? 'bg-primary/10'
              : message.role === 'assistant'
              ? 'bg-secondary/10'
              : 'bg-muted/10'
          )}
        >
          <div className="mb-2 text-sm font-semibold">
            {message.role === 'user' ? 'You' : 'Research Assistant'}:
          </div>
          <ReactMarkdown
            className="prose prose-sm dark:prose-invert"
            remarkPlugins={[remarkGfm]}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      ))}
      {isLoading && (
        <div className="flex items-center justify-center py-4">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
    </Card>
  );
};

export default ResearchStream; 