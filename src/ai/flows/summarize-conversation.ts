'use server';

/**
 * @fileOverview Summarizes project conversations into memorySummaries and marks messages as writtenToMemory.
 *
 * - summarizeConversation - A function that handles the summarization process.
 */

import {ai} from '@/ai/genkit';
import {
  SummarizeConversationInput,
  SummarizeConversationInputSchema,
  SummarizeConversationOutput,
  SummarizeConversationOutputSchema,
} from '@/ai/schemas';

export async function summarizeConversation(
  input: SummarizeConversationInput
): Promise<SummarizeConversationOutput> {
  return summarizeConversationFlow(input);
}

const summarizeConversationPrompt = ai.definePrompt({
  name: 'summarizeConversationPrompt',
  input: {schema: SummarizeConversationInputSchema},
  output: {schema: SummarizeConversationOutputSchema},
  prompt: `You are an AI assistant helping to summarize a conversation thread.

  Summarize the following messages from the thread into a concise summary:
  
  {% for messageId in messageIds %}
  Message ID: {{messageId}}
  {% endfor %}
  `,
});

const summarizeConversationFlow = ai.defineFlow(
  {
    name: 'summarizeConversationFlow',
    inputSchema: SummarizeConversationInputSchema,
    outputSchema: SummarizeConversationOutputSchema,
  },
  async input => {
    const {output} = await summarizeConversationPrompt(input);
    // TODO: Persist the summary to Firestore and mark messages as writtenToMemory
    return {
      summaryText: output!.summaryText,
    };
  }
);
