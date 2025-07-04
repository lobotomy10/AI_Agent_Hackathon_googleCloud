// src/ai/flows/generate-parenting-insight.ts
'use server';

/**
 * @fileOverview Generates personalized parenting insights based on baby activity.
 *
 * - generateParentingInsight - A function that generates parenting insights.
 * - GenerateParentingInsightInput - The input type for the generateParentingInsight function.
 * - GenerateParentingInsightOutput - The return type for the generateParentingInsight function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateParentingInsightInputSchema = z.object({
  babyActivityDescription: z
    .string()
    .describe('Description of the baby\'s current activity.'),
  parentingGoals: z
    .string()
    .describe('The parenting goals of the baby\'s parents.'),
  parentingStyles: z
    .string()
    .describe('The parenting styles of the baby\'s parents.'),
});
export type GenerateParentingInsightInput = z.infer<
  typeof GenerateParentingInsightInputSchema
>;

const GenerateParentingInsightOutputSchema = z.object({
  insight: z.string().describe('Personalized parenting insight.'),
  recommendation: z.string().describe('Actionable recommendation for the parent.'),
});
export type GenerateParentingInsightOutput = z.infer<
  typeof GenerateParentingInsightOutputSchema
>;

export async function generateParentingInsight(
  input: GenerateParentingInsightInput
): Promise<GenerateParentingInsightOutput> {
  return generateParentingInsightFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateParentingInsightPrompt',
  input: {schema: GenerateParentingInsightInputSchema},
  output: {schema: GenerateParentingInsightOutputSchema},
  prompt: `You are an AI parenting assistant that provides personalized insights and recommendations to parents based on their baby's activities, parenting goals, and parenting styles.

  Baby Activity: {{{babyActivityDescription}}}
  Parenting Goals: {{{parentingGoals}}}
  Parenting Styles: {{{parentingStyles}}}

  Generate a personalized parenting insight and an actionable recommendation for the parent. Focus on providing specific and practical advice that the parent can implement immediately.
  Insight:
  Recommendation:`,
});

const generateParentingInsightFlow = ai.defineFlow(
  {
    name: 'generateParentingInsightFlow',
    inputSchema: GenerateParentingInsightInputSchema,
    outputSchema: GenerateParentingInsightOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
