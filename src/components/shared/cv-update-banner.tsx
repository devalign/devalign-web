'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCVAnalysis } from '@/contexts/cv-analysis-context';

export function CVUpdateBanner() {
  const { isAnalysisReady, commitUpdate } = useCVAnalysis();

  if (!isAnalysisReady) return null;

  return (
    <div className="mb-6 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/20 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-300">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
          <Sparkles className="h-5 w-5 animate-pulse" />
        </div>
        <div className="space-y-0.5 text-center sm:text-left">
          <p className="text-sm font-bold text-foreground">¡Nuevo análisis de CV listo!</p>
          <p className="text-xs text-muted-foreground">
            Hemos procesado tu nuevo CV. Haz clic en sincronizar para actualizar tus habilidades, diagnóstico y plan de acción.
          </p>
        </div>
      </div>
      <Button
        onClick={commitUpdate}
        className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md active:scale-[0.98] shrink-0"
      >
        Sincronizar
      </Button>
    </div>
  );
}
