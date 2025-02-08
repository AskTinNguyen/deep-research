'use client';

import { type FC, useState, FormEvent, ChangeEvent } from 'react';
import { useChat } from 'ai/react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { ReloadIcon } from '@radix-ui/react-icons';

interface ResearchFormProps {
  onSubmit?: (query: string) => void;
  className?: string;
}

const ResearchForm: FC<ResearchFormProps> = ({ onSubmit, className = '' }) => {
  const [query, setQuery] = useState('');
  const { isLoading, append } = useChat();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      await append({
        content: query,
        role: 'user',
      });
      onSubmit?.(query);
      setQuery('');
    } catch (error) {
      console.error('Failed to submit research query:', error);
    }
  };

  return (
    <Card className={`p-4 ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Enter your research query..."
          value={query}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setQuery(e.target.value)}
          className="min-h-[100px] resize-none"
          disabled={isLoading}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading || !query.trim()}>
            {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Researching...' : 'Submit Query'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ResearchForm; 