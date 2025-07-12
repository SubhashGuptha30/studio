'use server';

/**
 * @fileOverview This file defines a Genkit flow for preprocessing CT scan images using AI.
 *
 * - preprocessCtScan - A function that handles the CT scan preprocessing process.
 * - PreprocessCtScanInput - The input type for the preprocessCtScan function.
 * - PreprocessCtScanOutput - The return type for the preprocessCtScan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PreprocessCtScanInputSchema = z.object({
  ctScanDataUri: z
    .string()
    .describe(
      "A CT scan image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type PreprocessCtScanInput = z.infer<typeof PreprocessCtScanInputSchema>;

const PreprocessCtScanOutputSchema = z.object({
  preprocessedCtScanDataUri: z
    .string()
    .describe(
      'The preprocessed CT scan image, as a data URI in the same format as the input.'
    ),
  preprocessingSteps: z.string().describe('A description of the preprocessing steps applied.'),
});
export type PreprocessCtScanOutput = z.infer<typeof PreprocessCtScanOutputSchema>;

export async function preprocessCtScan(input: PreprocessCtScanInput): Promise<PreprocessCtScanOutput> {
  return preprocessCtScanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'preprocessCtScanPrompt',
  input: {schema: PreprocessCtScanInputSchema},
  output: {schema: PreprocessCtScanOutputSchema},
  prompt: `You are an expert in medical image processing. Your task is to preprocess CT scan images to standardize and optimize them for tumor detection.

You will receive a CT scan image as a data URI. Apply the following preprocessing steps:

1.  Rescale the image to 256x256 pixels.
2.  Normalize pixel values to the range [0, 1].
3.  Crop the image to focus on the brain region, removing non-relevant areas like the skull.
4.  Apply noise reduction techniques such as homomorphic filtering or anisotropic diffusion.

Return the preprocessed image as a data URI and provide a description of the preprocessing steps applied.

Original CT Scan: {{media url=ctScanDataUri}}

Preprocessed CT Scan (as data URI):`,
});

const preprocessCtScanFlow = ai.defineFlow(
  {
    name: 'preprocessCtScanFlow',
    inputSchema: PreprocessCtScanInputSchema,
    outputSchema: PreprocessCtScanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
