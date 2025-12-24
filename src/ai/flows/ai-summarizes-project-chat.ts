'use server';

/**
 * @fileOverview This file defines a Genkit flow for the AI to summarize project chat threads into memory summaries.
 *
 * - aiSummarizesProjectChat - A function that orchestrates the AI's summarization of project chat threads.
 * - AISummarizesProjectChatInput - The input type for the aiSummarizesProjectChat function.
 * - AISummarizesProjectChatOutput - The output type for the aiSummarizesProjectChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AISummarizesProjectChatInputSchema = z.object({
  orgId: z.string().describe('The ID of the organization.'),
  projectId: z.string().describe('The ID of the project.'),
  threadId: z.string().describe('The ID of the chat thread.'),
  messages: z.array(z.object({
    messageId: z.string(),
    content: z.string(),
  })).describe('The messages from the chat thread to summarize.'),
});

export type AISummarizesProjectChatInput = z.infer<typeof AISummarizesProjectChatInputSchema>;

const AISummarizesProjectChatOutputSchema = z.object({
  summaryText: z.string().describe('The summarized text of the chat thread.'),
  messageIds: z.array(z.string()).describe('The IDs of the messages that were summarized.'),
});

export type AISummarizesProjectChatOutput = z.infer<typeof AISummarizesProjectChatOutputSchema>;

export async function aiSummarizesProjectChat(input: AISummarizesProjectChatInput): Promise<AISummarizesProjectChatOutput> {
  return aiSummarizesProjectChatFlow(input);
}

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
