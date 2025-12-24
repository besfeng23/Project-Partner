'use server';

/**
 * @fileOverview This file defines a Genkit flow for the AI Project Partner to create project artifacts based on user prompts.
 *
 * - aiCreateProjectArtifacts - The main function that orchestrates the AI's artifact creation.
 */

import {ai} from '@/ai/genkit';
import {
  AICreateProjectArtifactsInput,
  AICreateProjectArtifactsInputSchema,
  AICreateProjectArtifactsOutput,
  AICreateProjectArtifactsOutputSchema,
} from '@/ai/schemas';

export async function aiCreateProjectArtifacts(
  input: AICreateProjectArtifactsInput
): Promise<AICreateProjectArtifactsOutput> {
  return aiCreateProjectArtifactsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiCreateProjectArtifactsPrompt',
  input: {schema: AICreateProjectArtifactsInputSchema},
  output: {schema: AICreateProjectArtifactsOutputSchema},
  prompt: `You are an AI Project Partner, designed to streamline project management by creating tasks, logging decisions, adding constraints, and creating artifacts based on the project context and user prompts.\n\nHere's the project context:\nLatest Summaries: {{{latestSummaries}}}
Constraints: {{{constraints}}}
Tasks: {{{tasks}}}
Decisions: {{{decisions}}}
Artifacts: {{{artifacts}}}
Recent Chat Messages: {{{recentChatMessages}}}
\nUser Message: {{{userMessage}}}\n\nBased on the project context and user message, please provide the following STRICT JSON output:\n- tasksToCreate: An array of tasks to create. Include title, description, priority (p0, p1, or p2), acceptanceCriteria (an array of strings), and blocked (true or false).\n- decisionsToLog: An array of decisions to log. Include title, context, decision, and consequences.\n- constraintsToAdd: An array of constraints to add. Include text.\n- artifactsToAdd: An array of artifacts to add to the project. Include type, title, url (optional), text (optional), and storagePath (optional).\n- risks: An array of potential risks and their mitigations. Include risk and mitigation.\n- shortReply: A brief and helpful reply to the user.\n\nEnsure the output is valid JSON and adheres to the schema.  Do not include any explanation or preamble text.  The output should ONLY be the JSON. Double-check the formatting and that there are no missing fields.\n`,
});

const aiCreateProjectArtifactsFlow = ai.defineFlow(
  {
    name: 'aiCreateProjectArtifactsFlow',
    inputSchema: AICreateProjectArtifactsInputSchema,
    outputSchema: AICreateProjectArtifactsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
