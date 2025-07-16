'use server';

/**
 * @fileOverview Agent description generator.
 *
 * - generateAgentDescription - A function that generates a detailed agent description from a high-level description.
 * - GenerateAgentDescriptionInput - The input type for the generateAgentDescription function.
 * - GenerateAgentDescriptionOutput - The return type for the generateAgentDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAgentDescriptionInputSchema = z.object({
  highLevelDescription: z
    .string()
    .describe('A high-level description of the agent.'),
});
export type GenerateAgentDescriptionInput = z.infer<typeof GenerateAgentDescriptionInputSchema>;

const GenerateAgentDescriptionOutputSchema = z.object({
  detailedDescription: z
    .string()
    .describe('A detailed and refined description of the agent.'),
});
export type GenerateAgentDescriptionOutput = z.infer<typeof GenerateAgentDescriptionOutputSchema>;

export async function generateAgentDescription(input: GenerateAgentDescriptionInput): Promise<GenerateAgentDescriptionOutput> {
  return generateAgentDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAgentDescriptionPrompt',
  input: {schema: GenerateAgentDescriptionInputSchema},
  output: {schema: GenerateAgentDescriptionOutputSchema},
  prompt: `You are an expert AI agent designer.  A user wants to build an agent with the following high-level description: {{{highLevelDescription}}}.  Generate a more detailed and refined description to help the user get started quickly.`,
});

const generateAgentDescriptionFlow = ai.defineFlow(
  {
    name: 'generateAgentDescriptionFlow',
    inputSchema: GenerateAgentDescriptionInputSchema,
    outputSchema: GenerateAgentDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
