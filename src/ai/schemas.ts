import {z} from 'genkit';

export const AISummarizesProjectChatInputSchema = z.object({
  orgId: z.string().describe('The ID of the organization.'),
  projectId: z.string().describe('The ID of the project.'),
  threadId: z.string().describe('The ID of the chat thread.'),
  messages: z
    .array(
      z.object({
        messageId: z.string(),
        content: z.string(),
      })
    )
    .describe('The messages from the chat thread to summarize.'),
});

export type AISummarizesProjectChatInput = z.infer<
  typeof AISummarizesProjectChatInputSchema
>;

export const AISummarizesProjectChatOutputSchema = z.object({
  summaryText: z
    .string()
    .describe('The summarized text of the chat thread.'),
  messageIds: z
    .array(z.string())
    .describe('The IDs of the messages that were summarized.'),
});

export type AISummarizesProjectChatOutput = z.infer<
  typeof AISummarizesProjectChatOutputSchema
>;

export const SummarizeConversationInputSchema = z.object({
  orgId: z.string().describe('The organization ID.'),
  projectId: z.string().describe('The project ID.'),
  threadId: z.string().describe('The chat thread ID.'),
  messageIds: z
    .array(z.string())
    .describe('The IDs of the messages to summarize.'),
});
export type SummarizeConversationInput = z.infer<
  typeof SummarizeConversationInputSchema
>;

export const SummarizeConversationOutputSchema = z.object({
  summaryText: z.string().describe('The summarized text of the conversation.'),
});
export type SummarizeConversationOutput = z.infer<
  typeof SummarizeConversationOutputSchema
>;

export const SuggestNextActionInputSchema = z.object({
  orgId: z.string().describe('The organization ID.'),
  projectId: z.string().describe('The project ID.'),
  threadId: z.string().describe('The chat thread ID.'),
  mode: z
    .enum(['plan', 'unblock', 'audit', 'optimize', 'prompt_builder'])
    .describe('The mode of operation for the AI partner.'),
  userMessage: z.string().describe('The user message to the AI partner.'),
  latestSummaries: z
    .string()
    .optional()
    .describe('Latest summaries of the project.'),
  constraints: z.string().optional().describe('Constraints for the project.'),
  tasks: z
    .string()
    .optional()
    .describe('Tasks for the project (prioritize p0/blocked).'),
  decisions: z.string().optional().describe('Decisions made for the project.'),
  artifacts: z.string().optional().describe('Artifacts for the project.'),
  recentChatMessages: z
    .string()
    .optional()
    .describe('Recent chat messages in the project.'),
});
export type SuggestNextActionInput = z.infer<typeof SuggestNextActionInputSchema>;

export const SuggestNextActionOutputSchema = z.object({
  recommendedNextAction: z
    .string()
    .describe('The recommended next action for the project.'),
  tasksToCreate: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
        priority: z.enum(['p0', 'p1', 'p2']),
        acceptanceCriteria: z.array(z.string()),
        blocked: z.boolean(),
      })
    )
    .describe('Tasks to create for the project.'),
  decisionsToLog: z
    .array(
      z.object({
        title: z.string(),
        context: z.string(),
        decision: z.string(),
        consequences: z.string(),
      })
    )
    .describe('Decisions to log for the project.'),
  constraintsToAdd: z
    .array(
      z.object({
        text: z.string(),
      })
    )
    .describe('Constraints to add for the project.'),
  risks: z
    .array(
      z.object({
        risk: z.string(),
        mitigation: z.string(),
      })
    )
    .describe('Risks associated with the project.'),
  shortReply: z.string().describe('A short reply to the user message.'),
});
export type SuggestNextActionOutput = z.infer<
  typeof SuggestNextActionOutputSchema
>;

export const AICreateProjectArtifactsInputSchema = z.object({
  orgId: z.string().describe('The ID of the organization.'),
  projectId: z.string().describe('The ID of the project.'),
  threadId: z.string().describe('The ID of the chat thread.'),
  userMessage: z.string().describe('The message from the user.'),
  latestSummaries: z
    .string()
    .optional()
    .describe('Latest summaries of the project.'),
  constraints: z.string().optional().describe('Constraints for the project.'),
  tasks: z.string().optional().describe('Current tasks for the project.'),
  decisions: z.string().optional().describe('Current decisions for the project.'),
  artifacts: z.string().optional().describe('Project artifacts.'),
  recentChatMessages: z
    .string()
    .optional()
    .describe('Recent chat messages in the thread.'),
});

export type AICreateProjectArtifactsInput = z.infer<
  typeof AICreateProjectArtifactsInputSchema
>;

export const AICreateProjectArtifactsOutputSchema = z.object({
  tasksToCreate: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
        priority: z.enum(['p0', 'p1', 'p2']),
        acceptanceCriteria: z.array(z.string()),
        blocked: z.boolean(),
      })
    )
    .describe('An array of tasks to create.'),
  decisionsToLog: z
    .array(
      z.object({
        title: z.string(),
        context: z.string(),
        decision: z.string(),
        consequences: z.string(),
      })
    )
    .describe('An array of decisions to log.'),
  constraintsToAdd: z
    .array(
      z.object({
        text: z.string(),
      })
    )
    .describe('An array of constraints to add.'),
  artifactsToAdd: z
    .array(
      z.object({
        type: z.string(),
        title: z.string(),
        url: z.string().optional(),
        text: z.string().optional(),
        storagePath: z.string().optional(),
      })
    )
    .describe('An array of artifacts to add to the project.'),
  risks: z
    .array(
      z.object({
        risk: z.string(),
        mitigation: z.string(),
      })
    )
    .describe('An array of risks and their mitigations.'),
  shortReply: z
    .string()
    .describe('A brief and helpful reply to the user.'),
});

export type AICreateProjectArtifactsOutput = z.infer<
  typeof AICreateProjectArtifactsOutputSchema
>;

export const AICreateTasksDecisionsConstraintsInputSchema = z.object({
  orgId: z.string().describe('The ID of the organization.'),
  projectId: z.string().describe('The ID of the project.'),
  threadId: z.string().describe('The ID of the chat thread.'),
  mode: z
    .enum(['plan', 'unblock', 'audit', 'optimize', 'prompt_builder'])
    .describe('The mode of operation for the AI.'),
  userMessage: z.string().describe('The message from the user.'),
  latestSummaries: z
    .string()
    .optional()
    .describe('Latest summaries of the project.'),
  constraints: z.string().optional().describe('Constraints for the project.'),
  tasks: z.string().optional().describe('Current tasks for the project.'),
  decisions: z.string().optional().describe('Current decisions for the project.'),
  artifacts: z.string().optional().describe('Project artifacts.'),
  recentChatMessages: z
    .string()
    .optional()
    .describe('Recent chat messages in the thread.'),
});

export type AICreateTasksDecisionsConstraintsInput = z.infer<
  typeof AICreateTasksDecisionsConstraintsInputSchema
>;

export const AICreateTasksDecisionsConstraintsOutputSchema = z.object({
  recommendedNextAction: z
    .string()
    .describe('A single recommended next action for the user.'),
  tasksToCreate: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
        priority: z.enum(['p0', 'p1', 'p2']),
        acceptanceCriteria: z.array(z.string()),
        blocked: z-boolean(),
      })
    )
    .describe('An array of tasks to create.'),
  decisionsToLog: z
    .array(
      z.object({
        title: z.string(),
        context: z.string(),
        decision: z.string(),
        consequences: z.string(),
      })
    )
    .describe('An array of decisions to log.'),
  constraintsToAdd: z
    .array(
      z.object({
        text: z.string(),
      })
    )
    .describe('An array of constraints to add.'),
  risks: z
    .array(
      z.object({
        risk: z.string(),
        mitigation: z.string(),
      })
    )
    .describe('An array of risks and their mitigations.'),
  shortReply: z.string().describe('A short reply to the user message.'),
});

export type AICreateTasksDecisionsConstraintsOutput = z.infer<
  typeof AICreateTasksDecisionsConstraintsOutputSchema
>;
