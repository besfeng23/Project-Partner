'use server';
/**
 * @fileOverview This file defines the AI Project Partner flow for suggesting the next action in a project.
 *
 * - suggestNextAction - A function that takes project data and user input to suggest the next action.
 */

import {ai} from '@/ai/genkit';
import {
  SuggestNextActionInputSchema,
  SuggestNextActionOutputSchema,
  type SuggestNextActionInput,
  type SuggestNextActionOutput,
} from '@/ai/schemas';

const suggestNextActionPrompt = ai.definePrompt({
  name: 'suggestNextActionPrompt',
  input: {schema: SuggestNextActionInputSchema},
  output: {schema: SuggestNextActionOutputSchema},
  prompt: `You are an AI Project Partner, helping users manage their projects effectively.

Analyze the current project state and the user\'s message to suggest the most relevant next action.
Consider the following information when formulating your response:

User Message: {{{userMessage}}}
Mode: {{{mode}}}
Latest Summaries: {{{latestSummaries}}}
Constraints: {{{constraints}}}
Tasks: {{{tasks}}}
Decisions: {{{decisions}}}
Artifacts: {{{artifacts}}}
Recent Chat Messages: {{{recentChatMessages}}}

Based on this information, provide a JSON formatted response with the following keys:
- recommendedNextAction: A single, clear, and actionable next step for the user.
- tasksToCreate: An array of tasks that should be created to move the project forward. Include title, description, priority (p0, p1, or p2), acceptanceCriteria (an array of strings), and blocked (true or false).
- decisionsToLog: An array of decisions that should be logged based on the current state. Include title, context, decision, and consequences.
- constraintsToAdd: An array of constraints that should be added to guide future project decisions. Include text.
- risks: An array of potential risks associated with the project and their mitigations. Include risk and mitigation.
- shortReply: A brief, conversational reply to the user\'s message.

Ensure the response is in valid JSON format.
`,
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
