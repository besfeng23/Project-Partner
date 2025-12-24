/**
 * @fileOverview This file defines a Genkit flow for the AI Project Partner to create project artifacts based on user prompts.
 *
 * - aiCreateProjectArtifacts - The main function that orchestrates the AI's artifact creation.
 */
import {aiCreateProjectArtifactsFlow} from '@/ai/flows';
import {
  type AICreateProjectArtifactsInput,
  type AICreateProjectArtifactsOutput,
} from '@/ai/schemas';

export async function aiCreateProjectArtifacts(
  input: AICreateProjectArtifactsInput
): Promise<AICreateProjectArtifactsOutput> {
  return aiCreateProjectArtifactsFlow(input);
}
