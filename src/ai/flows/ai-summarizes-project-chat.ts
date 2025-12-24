/**
 * @fileOverview This file defines a Genkit flow for the AI to summarize project chat threads into memory summaries.
 *
 * - aiSummarizesProjectChat - A function that orchestrates the AI's summarization of project chat threads.
 */

import {aiSummarizesProjectChatFlow} from '@/ai/flows';
import {
  type AISummarizesProjectChatInput,
  type AISummarizesProjectChatOutput,
} from '@/ai/schemas';

export async function aiSummarizesProjectChat(
  input: AISummarizesProjectChatInput
): Promise<AISummarizesProjectChatOutput> {
  return aiSummarizesProjectChatFlow(input);
}
