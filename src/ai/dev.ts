import { config } from 'dotenv';
config();

import '@/ai/flows/preprocess-ct-scan.ts';
import '@/ai/flows/detect-tumor.ts';
import '@/ai/flows/explainable-tumor-detection.ts';