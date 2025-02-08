import { createResearchStream, ResearchMessage, DEFAULT_RESEARCH_PROMPT } from '@/lib/research-stream';

// Allow responses up to 5 minutes
export const maxDuration = 300;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Add system prompt if not present
    const hasSystemPrompt = messages.some((m: ResearchMessage) => m.role === 'system');
    const streamMessages = hasSystemPrompt
      ? messages
      : [{ role: 'system', content: DEFAULT_RESEARCH_PROMPT }, ...messages];

    const result = await createResearchStream(streamMessages, {
      reasoningEffort: 'medium',
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('[Research API Error]:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred during research processing' }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}