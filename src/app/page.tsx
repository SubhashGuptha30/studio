'use client';

import { useState } from 'react';
import { analyzeCtScan } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/header';
import { DicomUploader } from '@/components/dicom-uploader';
import { VisualizationPanel } from '@/components/visualization-panel';
import { ResultsPanel } from '@/components/results-panel';
import type { AppState } from '@/types';

// Helper to read file as Data URL
function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

export default function Home() {
  const [state, setState] = useState<AppState>({
    file: null,
    status: 'idle',
    result: null,
    error: null,
  });

  const { toast } = useToast();

  const handleAnalyze = async (file: File) => {
    setState({
      file,
      status: 'analyzing',
      result: null,
      error: null,
    });

    try {
      const ctScanDataUri = await readFileAsDataURL(file);
      const result = await analyzeCtScan({ ctScanDataUri });

      setState({
        file,
        status: 'success',
        result,
        error: null,
      });

      toast({
        title: "Analysis Complete",
        description: `Tumor detection finished with ${result.analysis.tumorDetectionResult.tumorPresent ? 'positive' : 'negative'} results.`,
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setState({
        file,
        status: 'error',
        result: null,
        error: errorMessage,
      });

      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: errorMessage,
      });
    }
  };

  const handleReset = () => {
    setState({
        file: null,
        status: 'idle',
        result: null,
        error: null,
    });
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          <div className="lg:col-span-1 flex flex-col gap-8">
            <DicomUploader onAnalyze={handleAnalyze} state={state} />
            <ResultsPanel state={state} onReset={handleReset} />
          </div>

          <div className="lg:col-span-2">
            <VisualizationPanel state={state} />
          </div>

        </div>
      </main>
    </div>
  );
}
