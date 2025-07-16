import { config } from 'dotenv';
config();

import '@/ai/flows/generate-agent-description.ts';
import '@/ai/flows/analyze-agent-feedback.ts';
import '@/ai/flows/process-multi-modal-input.ts';