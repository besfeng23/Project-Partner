'use server';

/**
 * @fileOverview This file defines a Genkit flow for the AI Project Partner to create project artifacts based on user prompts.
 *
 * - aiCreateProjectArtifacts - The main function that orchestrates the AI's artifact creation.
 * - AICreateProjectArtifactsInput - The input type for the aiCreateProjectArtifacts function.
 * - AICreateProjectArtifactsOutput - The output type for the aiCreateProjectArtifacts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AICreateProjectArtifactsInputSchema = z.object({
  orgId: z.string().describe('The ID of the organization.'),
  projectId: z.string().describe('The ID of the project.'),
  threadId: z.string().describe('The ID of the chat thread.'),
  userMessage: z.string().describe('The message from the user.'),
  latestSummaries: z.string().optional().describe('Latest summaries of the project.'),
  constraints: z.string().optional().describe('Constraints for the project.'),
  tasks: z.string().optional().describe('Current tasks for the project.'),
  decisions: z.string().optional().describe('Current decisions for the project.'),
  artifacts: z.string().optional().describe('Project artifacts.'),
  recentChatMessages: z.string().optional().describe('Recent chat messages in the thread.'),
});

export type AICreateProjectArtifactsInput = z.infer<typeof AICreateProjectArtifactsInputSchema>;

const AICreateProjectArtifactsOutputSchema = z.object({
  tasksToCreate: z.array(z.object({
    title: z.string(),
    description: z.string(),
    priority: z.enum(['p0', 'p1', 'p2']),
    acceptanceCriteria: z.array(z.string()),
    blocked: z.boolean(),
  })).describe('An array of tasks to create.'),
  decisionsToLog: z.array(z.object({
    title: z.string(),
    context: z.string(),
    decision: z.string(),
    consequences: z.string(),
  })).describe('An array of decisions to log.'),
  constraintsToAdd: z.array(z.object({
    text: z.string(),
  })).describe('An array of constraints to add.'),
  artifactsToAdd: z.array(z.object({
    type: z.string(),
    title: z.string(),
    url: z.string().optional(),
    text: z.string().optional(),
    storagePath: z.string().optional(),
  })).describe('An array of artifacts to add to the project.'),
  risks: z.array(z.object({
    risk: z.string(),
    mitigation: z.string(),
  })).describe('An array of risks and their mitigations.'),
  shortReply: z.string().describe('A brief and helpful reply to the user.'),
});

export type AICreateProjectArtifactsOutput = z.infer<typeof AICreateProjectArtifactsOutputSchema>;

export async function aiCreateProjectArtifacts(input: AICreateProjectArtifactsInput): Promise<AICreateProjectArtifactsOutput> {
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
