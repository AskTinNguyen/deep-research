'use client';

import { useChat } from 'ai/react';
import { useState } from 'react';
import { Toaster } from 'sonner';
import ResearchForm from '@/components/ResearchForm';
import ResearchStream from '@/components/ResearchStream';
import ResearchOutput from '@/components/ResearchOutput';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useToast } from '@/hooks/use-toast';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export default function ResearchPage() {
  const [retryCount, setRetryCount] = useState(0);
  const toast = useToast();
  
  const { messages, isLoading, append, reload } = useChat({
    api: '/api/research',
    initialMessages: [],
    onError: (error) => {
      toast.error('Failed to process research query. Please try again.');
      console.error('Chat error:', error);

      // Implement retry logic
      if (retryCount < MAX_RETRIES) {
        toast.loading('Retrying...');
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          reload();
        }, RETRY_DELAY * (retryCount + 1));
      }
    },
    onFinish: () => {
      if (retryCount > 0) {
        toast.success('Successfully recovered from error!');
        setRetryCount(0);
      }
    },
  });

  // Get the latest assistant message for the research output
  const latestAssistantMessage = messages
    .filter(m => m.role === 'assistant')
    .pop();

  const handleSubmit = async (query: string) => {
    try {
      toast.loading('Processing research query...');
      await append({
        content: query,
        role: 'user',
      });
      toast.success('Research query submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit research query. Please try again.');
      console.error('Submit error:', error);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <main className="container mx-auto p-4 space-y-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">Deep Research Assistant</h1>
          
          {/* Research Form */}
          <ErrorBoundary>
            <div className="mb-8">
              <ResearchForm onSubmit={handleSubmit} />
            </div>
          </ErrorBoundary>

          {/* Research Stream */}
          <ErrorBoundary>
            <div className="mb-8">
              <ResearchStream
                messages={messages}
                isLoading={isLoading}
              />
            </div>
          </ErrorBoundary>

          {/* Research Output */}
          <ErrorBoundary>
            <div>
              <ResearchOutput
                message={latestAssistantMessage}
                isLoading={isLoading}
              />
            </div>
          </ErrorBoundary>
        </div>
      </main>
    </>
  );
} 