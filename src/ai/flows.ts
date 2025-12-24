/**
 * @fileoverview This file contains the server-side async functions for running Genkit flows.
 * It is marked with "use server" and ONLY exports async functions.
 * All Genkit object definitions (prompts, flows) are in base.ts.
 */
'use server';

import {
  aiCreateProjectArtifactsFlow,
  aiCreateTasksDecisionsConstraintsFlow,
  aiSummarizesProjectChatFlow,
  suggestNextActionFlow,
  summarizeConversationFlow,
} from '@/ai/base';
import type {
  AICreateProjectArtifactsInput,
  AICreateTasksDecisionsConstraintsInput,
  AISummarizesProjectChatInput,
  SuggestNextActionInput,
  SummarizeConversationInput,
} from './schemas';

export async function runAiCreateProjectArtifactsFlow(
  input: AICreateProjectArtifactsInput
) {
  return await aiCreateProjectArtifactsFlow(input);
}

export async function runAiCreateTasksDecisionsConstraintsFlow(
  input: AICreateTasksDecisionsConstraintsInput
) {
  return await aiCreateTasksDecisionsConstraintsFlow(input);
}

export async function runSuggestNextActionFlow(input: SuggestNextActionInput) {
  return await suggestNextActionFlow(input);
}

export async function runAiSummarizesProjectChatFlow(
  input: AISummarizesProjectChatInput
) {
  return await aiSummarizesProjectChatFlow(input);
}

export async function runSummarizeConversationFlow(
  input: SummarizeConversationInput
) {
  return await summarizeConversationFlow(input);
}
