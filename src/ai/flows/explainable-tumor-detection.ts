'use server';
/**
 * @fileOverview Implements the AI-powered tumor detection flow with explainability using Grad-CAM heatmaps.
 *
 * - explainableTumorDetection - A function that initiates the tumor detection process and provides visual explanations.
 * - ExplainableTumorDetectionInput - The input type for the explainableTumorDetection function, including the CT scan data URI.
 * - ExplainableTumorDetectionOutput - The return type for the explainableTumorDetection function, including tumor detection results and Grad-CAM heatmaps.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainableTumorDetectionInputSchema = z.object({
  ctScanDataUri: z
    .string()
    .describe(
      "A brain CT scan in DICOM format, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExplainableTumorDetectionInput = z.infer<typeof ExplainableTumorDetectionInputSchema>;

const ExplainableTumorDetectionOutputSchema = z.object({
  tumorDetectionResult: z.object({
    tumorPresent: z.boolean().describe('Whether a tumor is detected in the CT scan.'),
    tumorType: z.string().describe('The type of tumor detected, if any.'),
    confidenceScore: z.number().describe('The confidence score of the tumor detection (0-1).'),
  }),
  gradCamHeatmap: z
    .string()
    .describe(
      'A Grad-CAM heatmap, as a data URI, highlighting the regions of interest used for tumor detection.'
    ),
});
export type ExplainableTumorDetectionOutput = z.infer<typeof ExplainableTumorDetectionOutputSchema>;

export async function explainableTumorDetection(
  input: ExplainableTumorDetectionInput
): Promise<ExplainableTumorDetectionOutput> {
  return explainableTumorDetectionFlow(input);
}

const explainableTumorDetectionPrompt = ai.definePrompt({
  name: 'explainableTumorDetectionPrompt',
  input: {schema: ExplainableTumorDetectionInputSchema},
  output: {schema: ExplainableTumorDetectionOutputSchema},
  prompt: `You are an expert radiologist specializing in brain tumor detection. Analyze the provided CT scan and generate tumor detection results with a Grad-CAM heatmap highlighting the regions of interest used for the prediction.

Analyze the following CT scan for potential tumors:

CT Scan: {{media url=ctScanDataUri}}

Based on your analysis, determine if a tumor is present, the tumor type (if any), and the confidence score of your prediction. Also, generate a Grad-CAM heatmap highlighting the regions of interest used for the prediction.

Ensure the Grad-CAM heatmap clearly indicates the areas that influenced the tumor detection.`,
});

const explainableTumorDetectionFlow = ai.defineFlow(
  {
    name: 'explainableTumorDetectionFlow',
    inputSchema: ExplainableTumorDetectionInputSchema,
    outputSchema: ExplainableTumorDetectionOutputSchema,
  },
  async input => {
    const {output} = await explainableTumorDetectionPrompt(input);
    return output!;
  }
);
