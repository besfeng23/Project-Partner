/**
 * @fileOverview This file defines a Genkit flow for the AI Project Partner to create project artifacts based on user prompts.
 *
 * - aiCreateProjectArtifacts - The main function that orchestrates the AI's artifact creation.
 */
'use server';

import {runAiCreateProjectArtifactsFlow} from '@/ai/flows';
import type {
  AICreateProjectArtifactsInput,
  AICreateProjectArtifactsOutput,
} from '@/ai/schemas';

export async function aiCreateProjectArtifacts(
  input: AICreateProjectArtifactsInput
): Promise<AICreateProjectArtifactsOutput> {
  return runAiCreateProjectArtifactsFlow(input);
}
