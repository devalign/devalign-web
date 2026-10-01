'use client';

import React, { useEffect, useState } from 'react';
import { Check, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DiagnosticLoadingBannerProps {
  isUpdating: boolean;
  isDiagnosed: boolean;
  onDismiss: () => void;
  onViewResults?: () => void;
}

export function DiagnosticLoadingBanner({
  isUpdating,
  isDiagnosed,
  onDismiss,
  onViewResults,
}: DiagnosticLoadingBannerProps) {
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    if (!isUpdating) return;
    if (isDiagnosed) {
      setProgress(100);
      return;
    }

    setProgress(20);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) return prev;
        const remaining = 92 - prev;
        return prev + Math.max(1, Math.round(remaining * 0.15));
      });
    }, 600);

    return () => clearInterval(interval);
  }, [isUpdating, isDiagnosed]);

  if (!isUpdating) return null;

  return (
    <div
      className={cn(
        'my-2 lg:my-6 p-4 rounded-xl border flex flex-col gap-3 transition-all duration-300 animate-in fade-in',
        isDiagnosed
          ? 'border-success/20 bg-success/5 dark:bg-success/10'
          : 'border-info/30 bg-info/10 dark:bg-info/20'
      )}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'rounded-lg p-2 shrink-0',
              isDiagnosed
                ? 'bg-success/10 text-success'
                : 'bg-info/20 text-info'
            )}
          >
            {isDiagnosed ? (
              <Check className="h-5 w-5" />
            ) : (
              <Loader2 className="h-5 w-5 animate-spin" />
            )}
          </div>
          <div className="space-y-0.5 text-center sm:text-left">
            <p className="text-sm font-bold text-foreground">
              {isDiagnosed ? '¡Diagnóstico completado!' : 'Generando diagnóstico...'}
            </p>
            <p className="text-xs text-muted-foreground">
              {isDiagnosed
                ? 'Tu perfil ha sido diagnosticado con éxito. Ya puedes explorar tus afinidades.'
                : 'Estamos calculando tus afinidades y construyendo tu perfil.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
          {isDiagnosed ? (
            <Button
              onClick={onViewResults || onDismiss}
              className="w-full sm:w-auto bg-success hover:bg-success/90 text-success-foreground text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md active:scale-[0.98] shrink-0"
            >
              Ver resultados
            </Button>
          ) : (
            <Button
              onClick={onDismiss}
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      {!isDiagnosed && (
        <div className="w-full space-y-1 pt-1">
          <div className="h-1.5 w-full rounded-full bg-secondary/80 overflow-hidden">
            <div
              className="h-full bg-info rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

