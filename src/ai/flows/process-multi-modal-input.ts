
'use server';
/**
 * @fileOverview Processes multi-modal input (text and images) to generate relevant responses.
 *
 * - processMultiModalInput - A function that handles the multi-modal input processing.
 * - ProcessMultiModalInputInput - The input type for the processMultiModalInput function.
 * - ProcessMultiModalInputOutput - The return type for the processMultiModalInput function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const ProcessMultiModalInputInputSchema = z.object({
  text: z.string().describe('Textual input from the user.'),
  imageDataUri: z
    .string()
    .describe(
      "Image data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    )
    .optional(),
  apiKey: z.string().optional().describe('The API key for the AI provider.'),
});
export type ProcessMultiModalInputInput = z.infer<typeof ProcessMultiModalInputInputSchema>;

const ProcessMultiModalInputOutputSchema = z.object({
  response: z.string().describe('The response generated based on the multi-modal input.'),
});
export type ProcessMultiModalInputOutput = z.infer<typeof ProcessMultiModalInputOutputSchema>;

export async function processMultiModalInput(input: ProcessMultiModalInputInput): Promise<ProcessMultiModalInputOutput> {
  return processMultiModalInputFlow(input);
}

const prompt = ai.definePrompt({
  name: 'processMultiModalInputPrompt',
  input: {schema: z.object({ text: z.string(), imageDataUri: z.string().optional() })},
  output: {schema: ProcessMultiModalInputOutputSchema},
  prompt: `You are an intelligent agent that can process both text and images to provide relevant responses.\n\nText: {{{text}}}\n\n{{#if imageDataUri}}
Image: {{media url=imageDataUri}}
{{/if}}\n\nResponse:`,
});

const processMultiModalInputFlow = ai.defineFlow(
  {
    name: 'processMultiModalInputFlow',
    inputSchema: ProcessMultiModalInputInputSchema,
    outputSchema: ProcessMultiModalInputOutputSchema,
  },
  async (input) => {
    if (!input.apiKey) {
      throw new Error("API key is required. Please add a Gemini API key on the 'API Keys' page.");
    }
    
    const {output} = await ai.run('processMultiModalInputPrompt', {
        text: input.text,
        imageDataUri: input.imageDataUri,
    }, {
        plugins: [googleAI({ apiKey: input.apiKey })],
        model: 'googleai/gemini-2.0-flash',
    });

    return output!;
  }
);
