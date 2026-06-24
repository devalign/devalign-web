'use client';

import React from 'react';
import { Sparkles, Network } from 'lucide-react';
import CVUploader from '@/components/profile/cv-uploader';

interface OverviewEmptyStateProps {
  onUploadSuccess: (cvId?: string) => void;
}

export function OverviewEmptyState({ onUploadSuccess }: OverviewEmptyStateProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4">
      <div className="max-w-md w-full bg-card/90 backdrop-blur-xl border border-border/80 rounded-3xl p-8 shadow-2xl space-y-6 text-center transition-all duration-300">
        <div className="space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-info/10 text-info shadow-inner">
            <Network className="w-8 h-8 animate-pulse" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-2xl font-black text-foreground tracking-tight flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-info shrink-0" />
              Genera tu Red Neuronal
            </h1>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Sube tu currículum para mapear tus competencias técnicas en un grafo interactivo de
              habilidades y descubrir tu afinidad con el mercado IT.
            </p>
          </div>
        </div>

        <div className="pt-2">
          <CVUploader onUploadSuccess={onUploadSuccess} />
        </div>
      </div>
    </div>
  );
}
