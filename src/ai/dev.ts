import { config } from 'dotenv';
config();

import '@/ai/schemas.ts';
import '@/ai/flows/ai-creates-tasks-decisions-constraints.ts';
import '@/ai/flows/ai-suggests-next-action.ts';
import '@/ai/flows/summarize-conversation.ts';
import '@/ai/flows/ai-summarizes-project-chat.ts';
import '@/ai/flows/ai-creates-project-artifacts.ts';
