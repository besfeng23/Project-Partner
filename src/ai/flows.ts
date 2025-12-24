'use server';

import {ai} from '@/ai/genkit';
import {
  AICreateProjectArtifactsInputSchema,
  AICreateProjectArtifactsOutputSchema,
  AICreateTasksDecisionsConstraintsInputSchema,
  AICreateTasksDecisionsConstraintsOutputSchema,
  AISummarizesProjectChatInputSchema,
  AISummarizesProjectChatOutputSchema,
  SuggestNextActionInputSchema,
  SuggestNextActionOutputSchema,
  SummarizeConversationInputSchema,
  SummarizeConversationOutputSchema,
} from './schemas';
import {defineFlow} from 'genkit';

// ######################################################################
// Prompt Definitions
// ######################################################################

const createProjectArtifactsPrompt = ai.definePrompt({
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

const createTasksDecisionsConstraintsPrompt = ai.definePrompt({
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

const summarizeProjectChatPrompt = ai.definePrompt({
  name: 'aiSummarizesProjectChatPrompt',
  input: {schema: AISummarizesProjectChatInputSchema},
  output: {schema: AISummarizesProjectChatOutputSchema},
  prompt: `You are an AI assistant summarizing a project chat thread to create a memory summary.

  Summarize the following messages from the chat thread into a concise summary:
  
  {{#each messages}}
  Message ID: {{this.messageId}}
  Content: {{this.content}}
  {{/each}}
  `,
});

const summarizeConversationPrompt = ai.definePrompt({
  name: 'summarizeConversationPrompt',
  input: {schema: SummarizeConversationInputSchema},
  output: {schema: SummarizeConversationOutputSchema},
  prompt: `You are an AI assistant helping to summarize a conversation thread.

  Summarize the following messages from the thread into a concise summary:
  
  {{#each messageIds}}
  Message ID: {{this}}
  {{/each}}
  `,
});


// ######################################################################
// Flow Definitions
// ######################################################################

const aiCreateProjectArtifactsFlow = ai.defineFlow(
  {
    name: 'aiCreateProjectArtifactsFlow',
    inputSchema: AICreateProjectArtifactsInputSchema,
    outputSchema: AICreateProjectArtifactsOutputSchema,
  },
  async input => {
    const {output} = await createProjectArtifactsPrompt(input);
    return output!;
  }
);

const aiCreateTasksDecisionsConstraintsFlow = ai.defineFlow(
  {
    name: 'aiCreateTasksDecisionsConstraintsFlow',
    inputSchema: AICreateTasksDecisionsConstraintsInputSchema,
    outputSchema: AICreateTasksDecisionsConstraintsOutputSchema,
  },
  async input => {
    const {output} = await createTasksDecisionsConstraintsPrompt(input);
    return output!;
  }
);

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

const aiSummarizesProjectChatFlow = ai.defineFlow(
  {
    name: 'aiSummarizesProjectChatFlow',
    inputSchema: AISummarizesProjectChatInputSchema,
    outputSchema: AISummarizesProjectChatOutputSchema,
  },
  async input => {
    const {output} = await summarizeProjectChatPrompt(input);
    return {
      summaryText: output!.summaryText,
      messageIds: input.messages.map(message => message.messageId),
    };
  }
);

const summarizeConversationFlow = ai.defineFlow(
  {
    name: 'summarizeConversationFlow',
    inputSchema: SummarizeConversationInputSchema,
    outputSchema: SummarizeConversationOutputSchema,
  },
  async input => {
    const {output} = await summarizeConversationPrompt(input);
    return {
      summaryText: output!.summaryText,
    };
  }
);

export async function runAiCreateProjectArtifactsFlow(input) {
  return await aiCreateProjectArtifactsFlow(input);
}
export async function runAiCreateTasksDecisionsConstraintsFlow(input) {
  return await aiCreateTasksDecisionsConstraintsFlow(input);
}
export async function runSuggestNextActionFlow(input) {
  return await suggestNextActionFlow(input);
}
export async function runAiSummarizesProjectChatFlow(input) {
  return await aiSummarizesProjectChatFlow(input);
}
export async function runSummarizeConversationFlow(input) {
  return await summarizeConversationFlow(input);
}
