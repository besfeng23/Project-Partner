import 'server-only';

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// This is a server-only file and should not be imported into client components.
export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
  // The model is defined in the prompt definitions in base.ts
});
