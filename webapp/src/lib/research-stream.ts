import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

type Role = 'system' | 'user' | 'assistant';

export interface ResearchMessage {
  role: Role;
  content: string;
}

export type ResearchStreamOptions = {
  reasoningEffort?: 'low' | 'medium' | 'high';
  systemPrompt?: string;
};

/**
 * Creates a research stream with the specified messages and options
 */
export async function createResearchStream(
  messages: ResearchMessage[],
  options: ResearchStreamOptions = {}
) {
  const { reasoningEffort = 'medium', systemPrompt } = options;

  // Add system prompt if provided
  const streamMessages = systemPrompt
    ? [{ role: 'system' as const, content: systemPrompt }, ...messages]
    : messages;

  return streamText({
    model: openai('o3-mini'),
    messages: streamMessages,
    providerOptions: {
      openai: {
        reasoningEffort,
      },
    },
  });
}

/**
 * Helper function to format user query into a research message
 */
export function createUserMessage(content: string): ResearchMessage {
  return {
    role: 'user',
    content,
  };
}

/**
 * Helper function to format system prompt into a research message
 */
export function createSystemMessage(content: string): ResearchMessage {
  return {
    role: 'system',
    content,
  };
}

/**
 * Default system prompt for research tasks
 */
export const DEFAULT_RESEARCH_PROMPT = `You are a research assistant helping to analyze and synthesize information. 
Provide clear, accurate, and well-structured responses.
Break down complex topics into understandable segments.
When appropriate, include relevant citations or references.
If uncertain about any information, clearly state the limitations of your knowledge.`; 