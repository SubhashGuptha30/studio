// This file uses server-only features
'use server';

/**
 * @fileOverview AI-powered tumor detection in brain CT scans.
 *
 * - detectTumor - A function that handles the tumor detection process.
 * - DetectTumorInput - The input type for the detectTumor function.
 * - DetectTumorOutput - The return type for the detectTumor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectTumorInputSchema = z.object({
  ctScanDataUri: z
    .string()
    .describe(
      "A brain CT scan in DICOM format, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DetectTumorInput = z.infer<typeof DetectTumorInputSchema>;

const DetectTumorOutputSchema = z.object({
  tumorDetected: z.boolean().describe('Whether a tumor is detected in the CT scan.'),
  confidenceScore: z
    .number()
    .describe('The confidence score (0-1) of the tumor detection.'),
  heatmapDataUri: z
    .string()
    .describe(
      'A data URI containing the Grad-CAM heatmap, highlighting regions of interest. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // keep the backslashes, escaping is needed
    ),
});
export type DetectTumorOutput = z.infer<typeof DetectTumorOutputSchema>;

export async function detectTumor(input: DetectTumorInput): Promise<DetectTumorOutput> {
  return detectTumorFlow(input);
}

const detectTumorPrompt = ai.definePrompt({
  name: 'detectTumorPrompt',
  input: {schema: DetectTumorInputSchema},
  output: {schema: DetectTumorOutputSchema},
  prompt: `You are an AI model specializing in detecting cancerous tumors in brain CT scans.

  Analyze the provided CT scan and determine if there is a tumor present. Provide a confidence score (0-1) for your detection.
  Generate a Grad-CAM heatmap highlighting the regions of interest that influenced your prediction. Return the heatmap as a data URI.

  CT Scan: {{media url=ctScanDataUri}}
  `,
});

const detectTumorFlow = ai.defineFlow(
  {
    name: 'detectTumorFlow',
    inputSchema: DetectTumorInputSchema,
    outputSchema: DetectTumorOutputSchema,
  },
  async input => {
    const {output} = await detectTumorPrompt(input);
    return output!;
  }
);
