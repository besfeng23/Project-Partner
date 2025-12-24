'use server';

/**
 * @fileOverview Summarizes project conversations into memorySummaries and marks messages as writtenToMemory.
 *
 * - summarizeConversation - A function that handles the summarization process.
 * - SummarizeConversationInput - The input type for the summarizeConversation function.
 * - SummarizeConversationOutput - The return type for the summarizeConversation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeConversationInputSchema = z.object({
  orgId: z.string().describe('The organization ID.'),
  projectId: z.string().describe('The project ID.'),
  threadId: z.string().describe('The chat thread ID.'),
  messageIds: z.array(z.string()).describe('The IDs of the messages to summarize.'),
});
export type SummarizeConversationInput = z.infer<
  typeof SummarizeConversationInputSchema
>;

const SummarizeConversationOutputSchema = z.object({
  summaryText: z.string().describe('The summarized text of the conversation.'),
});
export type SummarizeConversationOutput = z.infer<
  typeof SummarizeConversationOutputSchema
>;

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
