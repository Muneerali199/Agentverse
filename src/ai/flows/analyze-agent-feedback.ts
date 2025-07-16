'use server';

/**
 * @fileOverview An AI agent feedback analyzer.
 *
 * - analyzeAgentFeedback - A function that handles the agent feedback process.
 * - AnalyzeAgentFeedbackInput - The input type for the analyzeAgentFeedback function.
 * - AnalyzeAgentFeedbackOutput - The return type for the analyzeAgentFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeAgentFeedbackInputSchema = z.object({
  agentResponse: z.string().describe('The response given by the agent.'),
  userFeedback: z
    .string()
    .describe(
      'The feedback from the user.  This should be a string indicating whether the response was helpful or unhelpful, and why.'
    ),
  previousAgentResponses: z
    .array(z.string())
    .describe('The list of previous agent responses.'),
});
export type AnalyzeAgentFeedbackInput = z.infer<typeof AnalyzeAgentFeedbackInputSchema>;

const AnalyzeAgentFeedbackOutputSchema = z.object({
  updatedAgentResponse: z
    .string()
    .describe(
      'The updated agent response, incorporating the feedback from the user.'
    ),
});
export type AnalyzeAgentFeedbackOutput = z.infer<typeof AnalyzeAgentFeedbackOutputSchema>;

export async function analyzeAgentFeedback(
  input: AnalyzeAgentFeedbackInput
): Promise<AnalyzeAgentFeedbackOutput> {
  return analyzeAgentFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeAgentFeedbackPrompt',
  input: {schema: AnalyzeAgentFeedbackInputSchema},
  output: {schema: AnalyzeAgentFeedbackOutputSchema},
  prompt: `You are an AI agent that is responsible for improving its responses based on user feedback.

You will receive the agent's previous response, the user's feedback, and a list of previous agent responses.

Your goal is to improve the agent's response so that it is more helpful to the user in the future.

Previous agent responses: {{{previousAgentResponses}}}
Agent response: {{{agentResponse}}}
User feedback: {{{userFeedback}}}

Updated agent response:`,
});

const analyzeAgentFeedbackFlow = ai.defineFlow(
  {
    name: 'analyzeAgentFeedbackFlow',
    inputSchema: AnalyzeAgentFeedbackInputSchema,
    outputSchema: AnalyzeAgentFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
