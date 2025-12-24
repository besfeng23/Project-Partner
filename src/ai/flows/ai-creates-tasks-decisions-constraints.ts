'use server';

/**
 * @fileOverview This file defines a Genkit flow for the AI Project Partner that automatically creates tasks, logs decisions, and adds constraints based on project context and user prompts.
 *
 * - aiCreateTasksDecisionsConstraints - The main function that orchestrates the AI's task creation, decision logging, and constraint addition.
 */

import {ai} from '@/ai/genkit';
import {
  AICreateTasksDecisionsConstraintsInput,
  AICreateTasksDecisionsConstraintsInputSchema,
  AICreateTasksDecisionsConstraintsOutput,
  AICreateTasksDecisionsConstraintsOutputSchema,
} from '@/ai/schemas';

export async function aiCreateTasksDecisionsConstraints(
  input: AICreateTasksDecisionsConstraintsInput
): Promise<AICreateTasksDecisionsConstraintsOutput> {
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
