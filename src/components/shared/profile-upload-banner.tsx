'use client';

import React from 'react';
import Link from 'next/link';
import { Loader2, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCVAnalysis } from '@/contexts/cv-analysis-context';
import { cn } from '@/lib/utils';

interface ProfileUploadBannerProps {
  show?: boolean;
}

export function ProfileUploadBanner({ show }: ProfileUploadBannerProps) {
  const { isAnalysisReady, isAnalyzing, isSkillsDetected, analyzedCvId } = useCVAnalysis();

  const isVisible = show !== undefined ? show : isAnalyzing || isSkillsDetected || isAnalysisReady;

  if (!isVisible) return null;

  const isSuccess = isSkillsDetected || isAnalysisReady;
  const href = analyzedCvId ? `/profile/upload?cvId=${analyzedCvId}` : `/profile/upload`;

  return (
    <div
      className={cn(
        'my-2 lg:my-6 p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-300',
        'border-info/30 bg-info/10 dark:bg-info/20',
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'rounded-lg p-2',
            'bg-info/20 text-info',
          )}
        >
          {isSuccess ? <Check className="h-5 w-5" /> : <Loader2 className="h-5 w-5 animate-spin" />}
        </div>
        <div className="space-y-0.5 text-center sm:text-left">
          <p className="text-sm font-bold text-foreground">
            {isSuccess ? '¡Análisis de CV completado!' : 'Procesando tu CV...'}
          </p>
          <p className="text-xs text-muted-foreground">
            {isSuccess
              ? 'Por favor, revisa y confirma tus competencias detectadas.'
              : 'Estamos analizando tu currículum para extraer tus competencias y datos profesionales.'}
          </p>
        </div>
      </div>

      <Button
        asChild
        className={cn(
          'w-full sm:w-auto text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md active:scale-[0.98] shrink-0',
          'bg-info hover:bg-info/80 text-info-foreground gap-2',
        )}
      >
        <Link href={href}>
          {isSuccess ? 'Confirmar competencias' : 'Ver progreso'}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </Button>
    </div>
  );
}
