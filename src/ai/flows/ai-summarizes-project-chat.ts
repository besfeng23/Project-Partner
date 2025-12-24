'use server';

/**
 * @fileOverview This file defines a Genkit flow for the AI to summarize project chat threads into memory summaries.
 *
 * - aiSummarizesProjectChat - A function that orchestrates the AI's summarization of project chat threads.
 */

import {ai} from '@/ai/genkit';
import {
  AISummarizesProjectChatInputSchema,
  AISummarizesProjectChatOutputSchema,
  type AISummarizesProjectChatInput,
  type AISummarizesProjectChatOutput,
} from '@/ai/schemas';

const prompt = ai.definePrompt({
  name: 'aiSummarizesProjectChatPrompt',
  input: {schema: AISummarizesProjectChatInputSchema},
  output: {schema: AISummarizesProjectChatOutputSchema},
  prompt: `You are an AI assistant summarizing a project chat thread to create a memory summary.

  Summarize the following messages from the chat thread into a concise summary:
  
  {% for message in messages %}
  Message ID: {{message.messageId}}
  Content: {{message.content}}
  {% endfor %}
  `,
});

const aiSummarizesProjectChatFlow = ai.defineFlow(
  {
    name: 'aiSummarizesProjectChatFlow',
    inputSchema: AISummarizesProjectChatInputSchema,
    outputSchema: AISummarizesProjectChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    // TODO: Persist the summary to Firestore and mark messages as writtenToMemory
    return {
      summaryText: output!.summaryText,
      messageIds: input.messages.map(message => message.messageId),
    };
  }
);

export async function aiSummarizesProjectChat(
  input: AISummarizesProjectChatInput
): Promise<AISummarizesProjectChatOutput> {
  return aiSummarizesProjectChatFlow(input);
}
