/**
 * @fileOverview Summarizes project conversations into memorySummaries and marks messages as writtenToMemory.
 *
 * - summarizeConversation - A function that handles the summarization process.
 */

import {summarizeConversationFlow} from '@/ai/flows';
import {
  type SummarizeConversationInput,
  type SummarizeConversationOutput,
} from '@/ai/schemas';

export async function summarizeConversation(
  input: SummarizeConversationInput
): Promise<SummarizeConversationOutput> {
  return summarizeConversationFlow(input);
}
