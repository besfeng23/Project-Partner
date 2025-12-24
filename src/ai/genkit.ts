import 'server-only';

import { ai } from './base';

// This is a server-only file and should not be imported into client components.
// It re-exports the initialized 'ai' object from base.ts.
export { ai };
