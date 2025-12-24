'use server';

/**
 * @fileOverview This file defines a Genkit flow for the AI Project Partner that automatically creates tasks, logs decisions, and adds constraints based on project context and user prompts.
 *
 * - aiCreateTasksDecisionsConstraints - The main function that orchestrates the AI's task creation, decision logging, and constraint addition.
 */

import {ai} from '@/ai/genkit';
import {
  AICreateTasksDecisionsConstraintsInputSchema,
  AICreateTasksDecisionsConstraintsOutputSchema,
  type AICreateTasksDecisionsConstraintsInput,
  type AICreateTasksDecisionsConstraintsOutput,
} from '@/ai/schemas';

const prompt = ai.definePrompt({
  name: 'aiCreateTasksDecisionsConstraintsPrompt',
  input: {schema: AICreateTasksDecisionsConstraintsInputSchema},
  output: {schema: AICreateTasksDecisionsConstraintsOutputSchema},
  prompt: `You are an AI Project Partner, designed to streamline project management by automatically creating tasks, logging decisions, and adding constraints based on the project context and user prompts.

You operate in the following mode: {{{mode}}}.

Here's the project context:
Latest Summaries: {{{latestSummaries}}}
Constraints: {{{constraints}}}
Tasks: {{{tasks}}}
Decisions: {{{decisions}}}
Artifacts: {{{artifacts}}}
Recent Chat Messages: {{{recentChatMessages}}}

User Message: {{{userMessage}}}

Based on the project context and user message, please provide the following STRICT JSON output:
- recommendedNextAction: A single, clear, and actionable next step for the user.
- tasksToCreate: An array of tasks to create. Include title, description, priority (p0, p1, or p2), acceptanceCriteria (an array of strings), and blocked (true or false).
- decisionsToLog: An array of decisions to log. Include title, context, decision, and consequences.
- constraintsToAdd: An array of constraints to add. Include text.
- risks: An array of potential risks and their mitigations. Include risk and mitigation.
- shortReply: A brief and helpful reply to the user.

Ensure the output is valid JSON and adheres to the schema.  Do not include any explanation or preamble text.  The output should ONLY be the JSON. Double-check the formatting and that there are no missing fields.
`,
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


export async function aiCreateTasksDecisionsConstraints(
  input: AICreateTasksDecisionsConstraintsInput
): Promise<AICreateTasksDecisionsConstraintsOutput> {
  return aiCreateTasksDecisionsConstraintsFlow(input);
}
