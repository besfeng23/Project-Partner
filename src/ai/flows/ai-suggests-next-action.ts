'use server';
/**
 * @fileOverview This file defines the AI Project Partner flow for suggesting the next action in a project.
 *
 * - suggestNextAction - A function that takes project data and user input to suggest the next action.
 */

import {ai} from '@/ai/genkit';
import {
  SuggestNextActionInput,
  SuggestNextActionInputSchema,
  SuggestNextActionOutput,
  SuggestNextActionOutputSchema,
} from '@/ai/schemas';

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

export async function suggestNextAction(
  input: SuggestNextActionInput
): Promise<SuggestNextActionOutput> {
  return suggestNextActionFlow(input);
}
