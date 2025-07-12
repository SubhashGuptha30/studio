'use client';

import { useState, type DragEvent, type ChangeEvent } from 'react';
import { UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type { AppState } from '@/types';

type DicomUploaderProps = {
  onAnalyze: (file: File) => void;
  state: AppState;
};

export function DicomUploader({ onAnalyze, state }: DicomUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleFileValidation = (file: File): boolean => {
    // Basic validation for prototype. Real app would inspect DICOM headers.
    const validTypes = ['application/dicom', 'application/octet-stream'];
    const maxSize = 100 * 1024 * 1024; // 100 MB

    if (!validTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.dcm')) {
       toast({
         variant: 'destructive',
         title: 'Invalid File Type',
         description: 'Please upload a valid DICOM (.dcm) file.',
       });
       return false;
    }

    if (file.size > maxSize) {
       toast({
         variant: 'destructive',
         title: 'File Too Large',
         description: 'File size cannot exceed 100 MB.',
       });
       return false;
    }
    return true;
  };
  
  const handleFileSelect = (file: File | null) => {
    if (file && handleFileValidation(file)) {
      onAnalyze(file);
    }
  };

  const onDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // This is necessary to allow dropping
  };
  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-headline font-semibold">Upload CT Scan</h2>
      <div
        className={cn(
          'relative flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg transition-colors duration-300',
          isDragging ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50',
          { 'opacity-50 pointer-events-none': state.status === 'analyzing' }
        )}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <UploadCloud className="w-12 h-12 text-muted-foreground mb-4" />
        <p className="text-center text-muted-foreground">
          <label htmlFor="file-upload" className="font-semibold text-primary cursor-pointer hover:underline">
            Click to upload
          </label> or drag and drop
        </p>
        <p className="text-xs text-muted-foreground mt-1">DICOM, DCM files up to 100MB</p>
        <input
          id="file-upload"
          name="file-upload"
          type="file"
          className="sr-only"
          onChange={onFileChange}
          accept=".dcm,application/dicom"
          disabled={state.status === 'analyzing'}
        />
      </div>
    </div>
  );
}
