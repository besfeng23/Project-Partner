/**
 * @fileOverview This file defines a Genkit flow for the AI Project Partner that automatically creates tasks, logs decisions, and adds constraints based on project context and user prompts.
 *
 * - aiCreateTasksDecisionsConstraints - The main function that orchestrates the AI's task creation, decision logging, and constraint addition.
 */
'use server';

import {runAiCreateTasksDecisionsConstraintsFlow} from '@/ai/flows';
import {
  type AICreateTasksDecisionsConstraintsInput,
  type AICreateTasksDecisionsConstraintsOutput,
} from '@/ai/schemas';

export async function aiCreateTasksDecisionsConstraints(
  input: AICreateTasksDecisionsConstraintsInput
): Promise<AICreateTasksDecisionsConstraintsOutput> {
  return runAiCreateTasksDecisionsConstraintsFlow(input);
}
