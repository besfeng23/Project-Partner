/**
 * @fileOverview Summarizes project conversations into memorySummaries and marks messages as writtenToMemory.
 *
 * - summarizeConversation - A function that handles the summarization process.
 */
'use server';

import {runSummarizeConversationFlow} from '@/ai/flows';
import {
  type SummarizeConversationInput,
  type SummarizeConversationOutput,
} from '@/ai/schemas';

export async function summarizeConversation(
  input: SummarizeConversationInput
): Promise<SummarizeConversationOutput> {
  return runSummarizeConversationFlow(input);
}
