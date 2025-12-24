'use server';
/**
 * @fileOverview This file defines a Genkit flow for the AI Project Partner to create project artifacts based on user prompts.
 *
 * - aiCreateProjectArtifacts - The main function that orchestrates the AI's artifact creation.
 */

import {ai} from '@/ai/genkit';
import {
  AICreateProjectArtifactsInputSchema,
  AICreateProjectArtifactsOutputSchema,
  type AICreateProjectArtifactsInput,
  type AICreateProjectArtifactsOutput,
} from '@/ai/schemas';

const prompt = ai.definePrompt({
  name: 'aiCreateProjectArtifactsPrompt',
  input: {schema: AICreateProjectArtifactsInputSchema},
  output: {schema: AICreateProjectArtifactsOutputSchema},
  prompt: `You are an AI Project Partner, designed to streamline project management by creating tasks, logging decisions, adding constraints, and creating artifacts based on the project context and user prompts.

Here's the project context:
Latest Summaries: {{{latestSummaries}}}
Constraints: {{{constraints}}}
Tasks: {{{tasks}}}
Decisions: {{{decisions}}}
Artifacts: {{{artifacts}}}
Recent Chat Messages: {{{recentChatMessages}}}

User Message: {{{userMessage}}}

Based on the project context and user message, please provide the following STRICT JSON output:
- tasksToCreate: An array of tasks to create. Include title, description, priority (p0, p1, or p2), acceptanceCriteria (an array of strings), and blocked (true or false).
- decisionsToLog: An array of decisions to log. Include title, context, decision, and consequences.
- constraintsToAdd: An array of constraints to add. Include text.
- artifactsToAdd: An array of artifacts to add to the project. Include type, title, url (optional), text (optional), and storagePath (optional).
- risks: An array of potential risks and their mitigations. Include risk and mitigation.
- shortReply: A brief and helpful reply to the user.

Ensure the output is valid JSON and adheres to the schema. Do not include any explanation or preamble text. The output should ONLY be the JSON. Double-check the formatting and that there are no missing fields.
`,
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


export async function aiCreateProjectArtifacts(
  input: AICreateProjectArtifactsInput
): Promise<AICreateProjectArtifactsOutput> {
  return aiCreateProjectArtifactsFlow(input);
}
