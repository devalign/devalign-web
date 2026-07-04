'use client';

import { useEffect, useRef } from 'react';
import { Loader2, FileText, Brain, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCVAnalysis } from '@/contexts/cv-analysis-context';

interface StepProcessingCVProps {
  cvId: string;
  onSkillsDetected: () => void;
  onCancel: () => void;
}

export function StepProcessingCV({ cvId, onSkillsDetected, onCancel }: StepProcessingCVProps) {
  const {
    isAnalyzing,
    analysisPhase,
    elapsedSeconds,
    isSkillsDetected,
    isAnalysisReady,
    cancelAnalysis,
    startAnalysis,
  } = useCVAnalysis();
  const hasTriggeredRef = useRef(false);
  const hasStartedRef = useRef(false);

  // Start fresh analysis with the given cvId.
  // If the CV is already in a terminal state, polling will immediately detect
  // it and advance to the correct step.
  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    startAnalysis(cvId);
  }, [cvId, startAnalysis]);

  // Detect when skills are detected or analysis is complete
  useEffect(() => {
    if (hasTriggeredRef.current) return;

    if (isSkillsDetected) {
      hasTriggeredRef.current = true;
      onSkillsDetected();
    } else if (isAnalysisReady) {
      // If already fully analyzed (backwards compat), go to validation
      hasTriggeredRef.current = true;
      onSkillsDetected();
    }
  }, [isSkillsDetected, isAnalysisReady, onSkillsDetected]);

  const handleCancel = () => {
    cancelAnalysis();
    onCancel();
  };

  const stallWarning = elapsedSeconds >= 30;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h2 className="text-sm font-bold text-foreground">
          Paso 2: Procesando tu CV
        </h2>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                analysisPhase === 'phase2' || isSkillsDetected || isAnalysisReady
                  ? 'bg-primary/10 text-primary'
                  : 'bg-primary text-primary-foreground'
              }`}
            >
              {analysisPhase === 'phase2' || isSkillsDetected || isAnalysisReady ? (
                <FileText className="h-4 w-4" />
              ) : (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">
                Extrayendo información
              </p>
              <p className="text-xs text-muted-foreground">
                Comprobando formato y extrayendo información base
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                isSkillsDetected || isAnalysisReady
                  ? 'bg-primary text-primary-foreground'
                  : analysisPhase === 'phase2'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
              }`}
            >
              {isSkillsDetected || isAnalysisReady ? (
                <Brain className="h-4 w-4" />
              ) : analysisPhase === 'phase2' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <span className="text-xs">2</span>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">
                Procesando con IA
              </p>
              <p className="text-xs text-muted-foreground">
                Detectando tus competencias técnicas y blandas
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground">
            {elapsedSeconds}s transcurridos
          </span>
          {stallWarning && (
            <span className="text-xs text-amber-500 font-medium">
              Está tomando más tiempo de lo habitual
            </span>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          className="text-xs gap-2"
        >
          <X className="h-3.5 w-3.5" />
          Cancelar
        </Button>
      </div>
    </div>
  );
}

