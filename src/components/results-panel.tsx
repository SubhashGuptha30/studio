'use client';

import { FileText, TestTube, Thermometer, CheckCircle2, XCircle, Loader2, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import type { AppState } from '@/types';

type ResultsPanelProps = {
  state: AppState;
  onReset: () => void;
};

function LoadingState() {
    return (
        <div className="flex flex-col items-center justify-center text-center p-8">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="font-semibold font-headline text-lg">Analyzing Scan...</p>
            <p className="text-muted-foreground text-sm">Our AI is processing the image. Please wait.</p>
        </div>
    )
}

function IdleState() {
    return (
        <div className="flex flex-col items-center justify-center text-center p-8">
            <TestTube className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="font-semibold font-headline text-lg">Awaiting Analysis</p>
            <p className="text-muted-foreground text-sm">Upload a CT scan to begin the tumor detection process.</p>
        </div>
    )
}

function ResultDetails({ state, onReset }: ResultsPanelProps) {
  if (!state.result) return null;
  const { tumorPresent, tumorType, confidenceScore } = state.result.analysis.tumorDetectionResult;
  const confidencePercent = Math.round(confidenceScore * 100);

  return (
    <CardContent className="space-y-6 text-sm">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Status</span>
        {tumorPresent ? (
          <Badge variant="destructive">Tumor Detected</Badge>
        ) : (
          <Badge className="bg-green-600 hover:bg-green-700 text-primary-foreground">No Tumor Detected</Badge>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-muted-foreground flex items-center gap-2"><TestTube className="w-4 h-4" /> Tumor Type</span>
        <span className="font-medium">{tumorType}</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-2"><Thermometer className="w-4 h-4" /> Confidence</span>
            <span className="font-medium">{confidencePercent}%</span>
        </div>
        <Progress value={confidencePercent} className="h-2" />
      </div>

      <Separator />

      <div className="flex flex-col sm:flex-row gap-2">
        <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled>
            <FileText className="mr-2 h-4 w-4" />
            Download Report
        </Button>
        <Button variant="outline" className="w-full" onClick={onReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Analyze New Scan
        </Button>
      </div>
    </CardContent>
  )
}

export function ResultsPanel({ state, onReset }: ResultsPanelProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Analysis Results</CardTitle>
      </CardHeader>
      
      {state.status === 'idle' && <IdleState />}
      {state.status === 'analyzing' && <LoadingState />}
      {state.status === 'success' && <ResultDetails state={state} onReset={onReset} />}
      {state.status === 'error' && (
        <div className="flex flex-col items-center justify-center text-center p-8 text-destructive">
            <XCircle className="w-12 h-12 mb-4" />
            <p className="font-semibold font-headline text-lg">Analysis Failed</p>
            <p className="text-sm">{state.error || 'An unknown error occurred.'}</p>
            <Button variant="outline" className="mt-4" onClick={onReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
        </div>
      )}
    </Card>
  );
}
