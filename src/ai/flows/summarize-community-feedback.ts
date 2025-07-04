// Summarizes community feedback to identify key themes and potential issues for moderators.
'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeCommunityFeedbackInputSchema = z.object({
  feedbackText:
    z.string().describe('The community feedback text to summarize.'),
});
export type SummarizeCommunityFeedbackInput =
  z.infer<typeof SummarizeCommunityFeedbackInputSchema>;

const SummarizeCommunityFeedbackOutputSchema = z.object({
  summary: z.string().describe('The summarized feedback.'),
  keyThemes: z.array(z.string()).describe('The key themes identified in the feedback.'),
  potentialIssues:
    z.array(z.string()).describe('The potential issues identified in the feedback.'),
});
export type SummarizeCommunityFeedbackOutput =
  z.infer<typeof SummarizeCommunityFeedbackOutputSchema>;

export async function summarizeCommunityFeedback(
  input: SummarizeCommunityFeedbackInput
): Promise<SummarizeCommunityFeedbackOutput> {
  return summarizeCommunityFeedbackFlow(input);
}

const summarizeCommunityFeedbackPrompt = ai.definePrompt({
  name: 'summarizeCommunityFeedbackPrompt',
  input: {schema: SummarizeCommunityFeedbackInputSchema},
  output: {schema: SummarizeCommunityFeedbackOutputSchema},
  prompt: `You are an AI assistant helping a moderator summarize community feedback.

  Summarize the following feedback, identify the key themes, and list any potential issues.

  Feedback: {{{feedbackText}}}

  Summary:
  Key Themes:
  Potential Issues:`,
});

const summarizeCommunityFeedbackFlow = ai.defineFlow(
  {
    name: 'summarizeCommunityFeedbackFlow',
    inputSchema: SummarizeCommunityFeedbackInputSchema,
    outputSchema: SummarizeCommunityFeedbackOutputSchema,
  },
  async input => {
    const {output} = await summarizeCommunityFeedbackPrompt(input);
    return output!;
  }
);
