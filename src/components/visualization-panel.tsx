'use client';

import Image from 'next/image';
import { Rotate3d, ZoomIn, ZoomOut, Scan, Eye, EyeOff, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import type { AppState } from '@/types';

type VisualizationPanelProps = {
  state: AppState;
};

function Placeholder() {
    return (
        <div className="w-full h-full bg-muted/30 flex flex-col items-center justify-center rounded-lg">
            <Scan className="w-24 h-24 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-semibold text-muted-foreground">3D Visualization</p>
            <p className="text-sm text-muted-foreground">Upload a scan to view the 3D model</p>
        </div>
    )
}

export function VisualizationPanel({ state }: VisualizationPanelProps) {
  const [showHeatmap, setShowHeatmap] = useState(true);

  const scanUrl = state.result?.preprocessed.preprocessedCtScanDataUri;
  const heatmapUrl = state.result?.analysis.gradCamHeatmap;
  const isTumorDetected = state.result?.analysis.tumorDetectionResult.tumorPresent ?? false;

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="p-4 flex-1 flex flex-col gap-4">
        <div className="relative aspect-square w-full flex-1 bg-background rounded-lg overflow-hidden">
            {state.status === 'success' && scanUrl ? (
                <>
                    <Image
                        src={scanUrl}
                        alt="CT Scan"
                        fill
                        className="transition-opacity duration-500 object-contain"
                        data-ai-hint="brain scan"
                    />
                    {heatmapUrl && isTumorDetected && (
                       <Image
                        src={heatmapUrl}
                        alt="Tumor Heatmap"
                        fill
                        className={cn(
                            "transition-opacity duration-500 mix-blend-screen object-contain",
                            showHeatmap ? "opacity-70" : "opacity-0"
                        )}
                        data-ai-hint="heatmap overlay"
                       />
                    )}
                </>
            ) : (
                <Placeholder />
            )}
        </div>
        <Separator />
        <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" disabled><Rotate3d /></Button>
                <Button variant="outline" size="icon" disabled><ZoomIn /></Button>
                <Button variant="outline" size="icon" disabled><ZoomOut /></Button>
            </div>
            <div className='flex items-center gap-2'>
            {isTumorDetected && state.status === 'success' && (
                <Button variant="outline" onClick={() => setShowHeatmap(s => !s)} className="bg-accent/10 border-accent text-accent hover:bg-accent/20">
                    {showHeatmap ? <EyeOff className="mr-2" /> : <Eye className="mr-2" />}
                    {showHeatmap ? 'Hide Heatmap' : 'Show Heatmap'}
                </Button>
            )}
             <Button variant="outline" disabled>
                <Download className="mr-2" />
                Screenshot
             </Button>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
