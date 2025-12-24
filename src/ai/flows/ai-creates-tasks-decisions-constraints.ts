'use server';

/**
 * @fileOverview This file defines a Genkit flow for the AI Project Partner that automatically creates tasks, logs decisions, and adds constraints based on project context and user prompts.
 *
 * - aiCreateTasksDecisionsConstraints - The main function that orchestrates the AI's task creation, decision logging, and constraint addition.
 * - AICreateTasksDecisionsConstraintsInput - The input type for the aiCreateTasksDecisionsConstraints function.
 * - AICreateTasksDecisionsConstraintsOutput - The output type for the aiCreateTasksDecisionsConstraints function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AICreateTasksDecisionsConstraintsInputSchema = z.object({
  orgId: z.string().describe('The ID of the organization.'),
  projectId: z.string().describe('The ID of the project.'),
  threadId: z.string().describe('The ID of the chat thread.'),
  mode: z.enum(['plan', 'unblock', 'audit', 'optimize', 'prompt_builder']).describe('The mode of operation for the AI.'),
  userMessage: z.string().describe('The message from the user.'),
  latestSummaries: z.string().optional().describe('Latest summaries of the project.'),
  constraints: z.string().optional().describe('Constraints for the project.'),
  tasks: z.string().optional().describe('Current tasks for the project.'),
  decisions: z.string().optional().describe('Current decisions for the project.'),
  artifacts: z.string().optional().describe('Project artifacts.'),
  recentChatMessages: z.string().optional().describe('Recent chat messages in the thread.'),
});

export type AICreateTasksDecisionsConstraintsInput = z.infer<typeof AICreateTasksDecisionsConstraintsInputSchema>;

const AICreateTasksDecisionsConstraintsOutputSchema = z.object({
  recommendedNextAction: z.string().describe('A single recommended next action for the user.'),
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
  risks: z.array(z.object({
    risk: z.string(),
    mitigation: z.string(),
  })).describe('An array of risks and their mitigations.'),
  shortReply: z.string().describe('A short reply to the user message.'),
});

export type AICreateTasksDecisionsConstraintsOutput = z.infer<typeof AICreateTasksDecisionsConstraintsOutputSchema>;

export async function aiCreateTasksDecisionsConstraints(input: AICreateTasksDecisionsConstraintsInput): Promise<AICreateTasksDecisionsConstraintsOutput> {
  return aiCreateTasksDecisionsConstraintsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiCreateTasksDecisionsConstraintsPrompt',
  input: {schema: AICreateTasksDecisionsConstraintsInputSchema},
  output: {schema: AICreateTasksDecisionsConstraintsOutputSchema},
  prompt: `You are an AI Project Partner, designed to streamline project management by automatically creating tasks, logging decisions, and adding constraints based on the project context and user prompts.\n\nYou operate in the following mode: {{{mode}}}.\n\nHere's the project context:\nLatest Summaries: {{{latestSummaries}}}\nConstraints: {{{constraints}}}\nTasks: {{{tasks}}}\nDecisions: {{{decisions}}}\nArtifacts: {{{artifacts}}}\nRecent Chat Messages: {{{recentChatMessages}}}\n\nUser Message: {{{userMessage}}}\n\nBased on the project context and user message, please provide the following STRICT JSON output:\n- recommendedNextAction: A single, clear, and actionable next step for the user.\n- tasksToCreate: An array of tasks to create. Include title, description, priority (p0, p1, or p2), acceptanceCriteria (an array of strings), and blocked (true or false).\n- decisionsToLog: An array of decisions to log. Include title, context, decision, and consequences.\n- constraintsToAdd: An array of constraints to add. Include text.\n- risks: An array of potential risks and their mitigations. Include risk and mitigation.\n- shortReply: A brief and helpful reply to the user.\n\nEnsure the output is valid JSON and adheres to the schema.  Do not include any explanation or preamble text.  The output should ONLY be the JSON. Double-check the formatting and that there are no missing fields.\n`,
});

const aiCreateTasksDecisionsConstraintsFlow = ai.defineFlow(
  {
    name: 'aiCreateTasksDecisionsConstraintsFlow',
    inputSchema: AICreateTasksDecisionsConstraintsInputSchema,
    outputSchema: AICreateTasksDecisionsConstraintsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
