/**
 * @fileOverview This file defines the AI Project Partner flow for suggesting the next action in a project.
 *
 * - suggestNextAction - A function that takes project data and user input to suggest the next action.
 */

import {suggestNextActionFlow} from '@/ai/flows';
import {
  type SuggestNextActionInput,
  type SuggestNextActionOutput,
} from '@/ai/schemas';

export async function suggestNextAction(
  input: SuggestNextActionInput
): Promise<SuggestNextActionOutput> {
  return suggestNextActionFlow(input);
}
