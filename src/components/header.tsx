import { BrainCircuit } from 'lucide-react';
import React from 'react';

export function Header() {
  return (
    <header className="py-4 px-4 md:px-8 border-b border-border/40">
      <div className="container mx-auto flex items-center gap-3">
        <BrainCircuit className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold font-headline text-foreground">
          NeuroVision
        </h1>
      </div>
    </header>
  );
}
