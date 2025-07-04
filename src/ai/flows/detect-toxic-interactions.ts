// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview Detects toxic interactions in user-generated content using Gemini.
 *
 * - detectToxicity - A function that detects toxicity in text.
 * - DetectToxicityInput - The input type for the detectToxicity function.
 * - DetectToxicityOutput - The return type for the detectToxicity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectToxicityInputSchema = z.object({
  text: z.string().describe('The text to analyze for toxicity.'),
});
export type DetectToxicityInput = z.infer<typeof DetectToxicityInputSchema>;

const DetectToxicityOutputSchema = z.object({
  isToxic: z.boolean().describe('Whether the text is toxic or not.'),
  toxicityReason:
    z.string()
    .optional()
    .describe('The reason why the text is considered toxic.'),
});
export type DetectToxicityOutput = z.infer<typeof DetectToxicityOutputSchema>;

export async function detectToxicity(input: DetectToxicityInput): Promise<DetectToxicityOutput> {
  return detectToxicityFlow(input);
}

const detectToxicityPrompt = ai.definePrompt({
  name: 'detectToxicityPrompt',
  input: {schema: DetectToxicityInputSchema},
  output: {schema: DetectToxicityOutputSchema},
  prompt: `You are an AI assistant specialized in detecting toxic content in online posts.

  Analyze the following text and determine if it contains toxic content such as hate speech, harassment, threats, or profanity.
  Return a JSON object indicating whether the text is toxic and, if so, the reason for the classification.

  Text: {{{text}}}
  `,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const detectToxicityFlow = ai.defineFlow(
  {
    name: 'detectToxicityFlow',
    inputSchema: DetectToxicityInputSchema,
    outputSchema: DetectToxicityOutputSchema,
  },
  async input => {
    const {output} = await detectToxicityPrompt(input);
    return output!;
  }
);
