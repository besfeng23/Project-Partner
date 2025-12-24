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
  AICreateProjectArtifactsOutput,
  AICreateTasksDecisionsConstraintsInput,
  AICreateTasksDecisionsConstraintsOutput,
  AISummarizesProjectChatInput,
  AISummarizesProjectChatOutput,
  SuggestNextActionInput,
  SuggestNextActionOutput,
  SummarizeConversationInput,
  SummarizeConversationOutput,
} from './schemas';

export async function runAiCreateProjectArtifactsFlow(
  input: AICreateProjectArtifactsInput
): Promise<AICreateProjectArtifactsOutput> {
  const result = await aiCreateProjectArtifactsFlow(input);
  return result;
}

export async function runAiCreateTasksDecisionsConstraintsFlow(
  input: AICreateTasksDecisionsConstraintsInput
): Promise<AICreateTasksDecisionsConstraintsOutput> {
  const result = await aiCreateTasksDecisionsConstraintsFlow(input);
  return result;
}

export async function runSuggestNextActionFlow(
  input: SuggestNextActionInput
): Promise<SuggestNextActionOutput> {
  const result = await suggestNextActionFlow(input);
  return result;
}

export async function runAiSummarizesProjectChatFlow(
  input: AISummarizesProjectChatInput
): Promise<AISummarizesProjectChatOutput> {
  const result = await aiSummarizesProjectChatFlow(input);
  return result;
}

export async function runSummarizeConversationFlow(
  input: SummarizeConversationInput
): Promise<SummarizeConversationOutput> {
  const result = await summarizeConversationFlow(input);
  return result;
}
