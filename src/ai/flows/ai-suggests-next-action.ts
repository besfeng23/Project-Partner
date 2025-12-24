'use server';
/**
 * @fileOverview This file defines the AI Project Partner flow for suggesting the next action in a project.
 *
 * - suggestNextAction - A function that takes project data and user input to suggest the next action.
 * - SuggestNextActionInput - The input type for the suggestNextAction function.
 * - SuggestNextActionOutput - The return type for the suggestNextAction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestNextActionInputSchema = z.object({
  orgId: z.string().describe('The organization ID.'),
  projectId: z.string().describe('The project ID.'),
  threadId: z.string().describe('The chat thread ID.'),
  mode: z.enum(['plan', 'unblock', 'audit', 'optimize', 'prompt_builder']).describe('The mode of operation for the AI partner.'),
  userMessage: z.string().describe('The user message to the AI partner.'),
  latestSummaries: z.string().optional().describe('Latest summaries of the project.'),
  constraints: z.string().optional().describe('Constraints for the project.'),
  tasks: z.string().optional().describe('Tasks for the project (prioritize p0/blocked).'),
  decisions: z.string().optional().describe('Decisions made for the project.'),
  artifacts: z.string().optional().describe('Artifacts for the project.'),
  recentChatMessages: z.string().optional().describe('Recent chat messages in the project.'),
});
export type SuggestNextActionInput = z.infer<typeof SuggestNextActionInputSchema>;

const SuggestNextActionOutputSchema = z.object({
  recommendedNextAction: z.string().describe('The recommended next action for the project.'),
  tasksToCreate: z.array(z.object({
    title: z.string(),
    description: z.string(),
    priority: z.enum(['p0', 'p1', 'p2']),
    acceptanceCriteria: z.array(z.string()),
    blocked: z.boolean(),
  })).describe('Tasks to create for the project.'),
  decisionsToLog: z.array(z.object({
    title: z.string(),
    context: z.string(),
    decision: z.string(),
    consequences: z.string(),
  })).describe('Decisions to log for the project.'),
  constraintsToAdd: z.array(z.object({
    text: z.string(),
  })).describe('Constraints to add for the project.'),
  risks: z.array(z.object({
    risk: z.string(),
    mitigation: z.string(),
  })).describe('Risks associated with the project.'),
  shortReply: z.string().describe('A short reply to the user message.'),
});
export type SuggestNextActionOutput = z.infer<typeof SuggestNextActionOutputSchema>;

export async function suggestNextAction(input: SuggestNextActionInput): Promise<SuggestNextActionOutput> {
  return suggestNextActionFlow(input);
}

const suggestNextActionPrompt = ai.definePrompt({
  name: 'suggestNextActionPrompt',
  input: {schema: SuggestNextActionInputSchema},
  output: {schema: SuggestNextActionOutputSchema},
  prompt: `You are an AI Project Partner, helping users manage their projects effectively.\n\nAnalyze the current project state and the user\'s message to suggest the most relevant next action.\nConsider the following information when formulating your response:\n\nUser Message: {{{userMessage}}}\nMode: {{{mode}}}\nLatest Summaries: {{{latestSummaries}}}\nConstraints: {{{constraints}}}\nTasks: {{{tasks}}}\nDecisions: {{{decisions}}}\nArtifacts: {{{artifacts}}}\nRecent Chat Messages: {{{recentChatMessages}}}\n\nBased on this information, provide a JSON formatted response with the following keys:\n- recommendedNextAction: A single, clear, and actionable next step for the user.\n- tasksToCreate: An array of tasks that should be created to move the project forward. Include title, description, priority (p0, p1, or p2), acceptanceCriteria (an array of strings), and blocked (true or false).\n- decisionsToLog: An array of decisions that should be logged based on the current state. Include title, context, decision, and consequences.\n- constraintsToAdd: An array of constraints that should be added to guide future project decisions. Include text.\n- risks: An array of potential risks associated with the project and their mitigations. Include risk and mitigation.\n- shortReply: A brief, conversational reply to the user\'s message.\n\nEnsure the response is in valid JSON format.\n`,
});

const suggestNextActionFlow = ai.defineFlow(
  {
    name: 'suggestNextActionFlow',
    inputSchema: SuggestNextActionInputSchema,
    outputSchema: SuggestNextActionOutputSchema,
  },
  async input => {
    const {output} = await suggestNextActionPrompt(input);
    return output!;
  }
);
