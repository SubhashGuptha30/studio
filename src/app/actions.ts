'use server';

import type { ExplainableTumorDetectionInput, ExplainableTumorDetectionOutput } from '@/ai/flows/explainable-tumor-detection';
import type { PreprocessCtScanOutput } from '@/ai/flows/preprocess-ct-scan';

// This is a mock implementation to simulate AI processing for the prototype.
// The actual Genkit flow calls are commented out but would be used in a real scenario.
// import { explainableTumorDetection } from '@/ai/flows/explainable-tumor-detection';
// import { preprocessCtScan } from '@/ai/flows/preprocess-ct-scan';

const MOCK_ANALYSIS_DELAY = 3000;

export type AnalysisResult = {
    preprocessed: PreprocessCtScanOutput,
    analysis: ExplainableTumorDetectionOutput
}

// Mock data for a successful tumor detection
const mockTumorResult: AnalysisResult = {
  preprocessed: {
    preprocessedCtScanDataUri: 'https://placehold.co/512x512/1a1a1a/f0f4f9.png',
    preprocessingSteps: '1. Rescaled to 256x256. 2. Normalized pixel values. 3. Cropped to brain region. 4. Applied noise reduction.'
  },
  analysis: {
    tumorDetectionResult: {
      tumorPresent: true,
      tumorType: 'Glioblastoma',
      confidenceScore: 0.92,
    },
    gradCamHeatmap: 'https://placehold.co/512x512/ff6347/1a1a1a.png',
  }
};

// Mock data for a "no tumor" detection
const mockNoTumorResult: AnalysisResult = {
  preprocessed: {
    preprocessedCtScanDataUri: 'https://placehold.co/512x512/1a1a1a/f0f4f9.png',
    preprocessingSteps: '1. Rescaled to 256x256. 2. Normalized pixel values. 3. Cropped to brain region. 4. Applied noise reduction.'
  },
  analysis: {
    tumorDetectionResult: {
      tumorPresent: false,
      tumorType: 'N/A',
      confidenceScore: 0.98,
    },
    gradCamHeatmap: 'https://placehold.co/512x512/1a1a1a/1a1a1a.png', // Blank heatmap
  }
};


export async function analyzeCtScan(
  input: ExplainableTumorDetectionInput
): Promise<AnalysisResult> {
  console.log('Starting CT Scan Analysis for:', input.ctScanDataUri.substring(0, 50) + '...');
  
  // Real implementation would be:
  // const preprocessed = await preprocessCtScan({ ctScanDataUri: input.ctScanDataUri });
  // const analysis = await explainableTumorDetection({ ctScanDataUri: preprocessed.preprocessedCtScanDataUri });
  // return { preprocessed, analysis };

  // Mock implementation for prototyping:
  await new Promise(resolve => setTimeout(resolve, MOCK_ANALYSIS_DELAY));
  
  // To make the mock dynamic, we'll randomly return tumor or no tumor.
  const result = Math.random() > 0.4 ? mockTumorResult : mockNoTumorResult;

  // We'll use the uploaded file as the base image for a more realistic feel.
  result.preprocessed.preprocessedCtScanDataUri = input.ctScanDataUri;

  console.log('Analysis complete. Tumor present:', result.analysis.tumorDetectionResult.tumorPresent);

  return result;
}
