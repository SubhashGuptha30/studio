import type { AnalysisResult } from "@/app/actions";

export type AppState = {
  file: File | null;
  status: 'idle' | 'analyzing' | 'success' | 'error';
  result: AnalysisResult | null;
  error: string | null;
};
