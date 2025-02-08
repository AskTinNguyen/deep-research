import { createResearchStream, ResearchMessage, DEFAULT_RESEARCH_PROMPT } from '../../../lib/research-stream';

// Allow responses up to 5 minutes
export const maxDuration = 300;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = await createResearchStream(messages as ResearchMessage[], {
      systemPrompt: DEFAULT_RESEARCH_PROMPT,
      reasoningEffort: 'medium',
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('[Research API Error]:', error);
    return new Response('An error occurred during research processing', { status: 500 });
  }
}