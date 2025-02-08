'use client';

import { type FC, useState } from 'react';
import { Message } from 'ai';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CopyIcon, Share1Icon as ShareIcon, CheckIcon } from '@radix-ui/react-icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface ResearchMessage extends Message {
  citations?: string[];
}

interface ResearchOutputProps {
  message?: ResearchMessage;
  isLoading?: boolean;
  className?: string;
}

const ResearchOutput: FC<ResearchOutputProps> = ({
  message,
  isLoading = false,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!message?.content) return;
    
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const handleShare = async () => {
    if (!message?.content) return;

    try {
      await navigator.share({
        title: 'Research Results',
        text: message.content,
      });
    } catch (error) {
      // If Web Share API is not supported or fails, fallback to copy
      handleCopy();
    }
  };

  if (!message && !isLoading) {
    return null;
  }

  return (
    <Card className={cn('', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Research Output</CardTitle>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleCopy}
            disabled={isLoading || !message}
            title="Copy to clipboard"
          >
            {copied ? (
              <CheckIcon className="h-4 w-4 text-green-500" />
            ) : (
              <CopyIcon className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleShare}
            disabled={isLoading || !message}
            title="Share results"
          >
            <ShareIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : message ? (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
            {message.citations && message.citations.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <h3 className="text-sm font-semibold">Citations</h3>
                <ul className="list-decimal pl-4 text-sm text-muted-foreground">
                  {message.citations.map((citation: string, index: number) => (
                    <li key={index} className="mt-2">
                      {citation}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default ResearchOutput; 