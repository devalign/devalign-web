'use client';

import React from 'react';
import { Sparkles, Loader2, FileText, Brain, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCVAnalysis } from '@/contexts/cv-analysis-context';
import type { AnalysisPhase } from '@/contexts/cv-analysis-context';
import { cn } from '@/lib/utils';

interface CVUpdateBannerProps {
  source?: 'cv-analysis' | 'profile-recalculation';
  mode?: 'proactive' | 'reactive';
  show?: boolean;
  onSync?: () => void;
  onCancel?: () => void;
}

const PHASE_CONFIG: Record<AnalysisPhase, { label: string; icon: typeof FileText }> = {
  phase1: { label: 'Extrayendo información', icon: FileText },
  phase2: { label: 'Analizando habilidades', icon: Brain },
};

function StepIndicator({ phase, current }: { phase: AnalysisPhase; current: AnalysisPhase }) {
  const config = PHASE_CONFIG[phase];
  const Icon = config.icon;
  const stepIndex = phase === 'phase1' ? 0 : 1;
  const currentIndex = current === 'phase1' ? 0 : 1;
  const isCompleted = stepIndex < currentIndex;
  const isActive = stepIndex === currentIndex;

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          'flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-all duration-300',
          isCompleted && 'bg-success/20 text-success',
          isActive && 'bg-primary/20 text-primary ring-2 ring-primary/30',
          !isActive && !isCompleted && 'bg-muted text-muted-foreground',
        )}
      >
        {isCompleted ? (
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          stepIndex + 1
        )}
      </div>
      <span
        className={cn(
          'text-xs font-semibold transition-colors',
          isActive && 'text-foreground',
          isCompleted && 'text-success',
          !isActive && !isCompleted && 'text-muted-foreground',
        )}
      >
        {config.label}
      </span>
      {isActive && (
        <Loader2 className="h-3 w-3 animate-spin text-primary shrink-0" />
      )}
    </div>
  );
}

export function CVUpdateBanner({ source = 'cv-analysis', mode = 'proactive', show, onSync, onCancel }: CVUpdateBannerProps) {
  const { isAnalysisReady, isAnalyzing, analysisPhase, elapsedSeconds, commitUpdate, cancelAnalysis } = useCVAnalysis();

  // Show during analysis OR when analysis has completed and data is ready.
  const isVisible = show !== undefined ? show : (isAnalyzing || isAnalysisReady);
  const handleSync = onSync || commitUpdate;
  const handleCancel = onCancel || cancelAnalysis;

  if (!isVisible) return null;

  // --- During analysis: show progress steps + timer ---
  if (isAnalyzing && !isAnalysisReady) {
    const showStallWarning = elapsedSeconds > 30;
    return (
      <div className="my-2 lg:my-6 p-4 rounded-xl border border-info/20 bg-info/5 dark:bg-info/15 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-3 flex-1 min-w-0">
            <StepIndicator phase="phase1" current={analysisPhase} />
            <StepIndicator phase="phase2" current={analysisPhase} />
            {showStallWarning && (
              <p className="text-[10px] text-warning font-semibold animate-in fade-in slide-in-from-top-1 duration-300">
                Tardando más de lo esperado... El análisis sigue en curso.
              </p>
            )}
          </div>
          <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
            <span className="text-[10px] font-mono text-muted-foreground tabular-nums shrink-0">
              {elapsedSeconds}s
            </span>
            <Button
              onClick={handleCancel}
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-xs font-semibold text-muted-foreground hover:text-destructive hover:bg-destructive/10 px-2.5"
            >
              <X className="h-3.5 w-3.5" />
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // --- Analysis complete: show success banner with close button ---
  const title =
    source === 'profile-recalculation'
      ? '¡Recalibración completada!'
      : '¡Análisis de CV completado!';

  const description =
    source === 'profile-recalculation'
      ? 'Tu perfil se ha guardado y el diagnóstico ha sido recalculado.'
      : 'Hemos procesado tu CV. Tu perfil se ha actualizado con los últimos datos.';

  return (
    <div className="my-2 lg:my-6 p-4 rounded-xl border border-success/20 bg-success/5 dark:bg-success/15 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-300">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-success/10 p-2 text-success dark:text-success">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="space-y-0.5 text-center sm:text-left">
          <p className="text-sm font-bold text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <Button
        onClick={handleSync}
        variant="outline"
        size="sm"
        className="h-8 gap-1.5 text-xs font-bold px-3 shrink-0"
      >
        <X className="h-3.5 w-3.5" />
        Cerrar
      </Button>
    </div>
  );
}
