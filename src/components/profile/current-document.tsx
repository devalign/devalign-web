'use client';

import React from 'react';
import { useUserCVs } from '@/hooks/use-user-cvs';
import { FileText, HardDrive, ArrowRight, ShieldCheck, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CurrentDocumentProps {
  onUpdateClick?: () => void;
  onGenerateCVClick?: () => void;
}

export default function CurrentDocument({ onUpdateClick, onGenerateCVClick }: CurrentDocumentProps) {
  const { data: cvData, isLoading } = useUserCVs();

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-1/3 rounded bg-muted animate-pulse" />
            <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const currentCV = cvData?.cvs?.[0];

  if (!currentCV) return null;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          CV Activo
        </h4>
        <div className="flex items-center gap-1.5 text-xs text-primary-foreground dark:text-primary font-bold bg-primary/5 border border-primary/20 px-2.5 py-0.5 rounded-full">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          Analizado
        </div>
      </div>

      <div className="flex flex-col items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="rounded-xl bg-red-50 p-2.5 text-red-500 shrink-0 dark:bg-red-950/30">
            <FileText className="h-5 w-5" />
          </div>
          <div className="space-y-0.5 min-w-0">
            <p
              className="text-sm font-semibold text-foreground truncate max-w-[200px] sm:max-w-xs md:max-w-md"
              title={currentCV.original_filename}
            >
              {currentCV.original_filename}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
              <span className="flex items-center gap-1 shrink-0">
                <HardDrive className="h-3.5 w-3.5 text-muted-foreground/60" />
                {(currentCV.size_bytes / 1024 / 1024).toFixed(2)} MB
              </span>
              <span>&bull;</span>
              {currentCV.download_url && (
                <a
                  href={currentCV.download_url}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline text-primary"
                >
                  Original
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2 shrink-0 w-full sm:w-auto">
          {onGenerateCVClick && (
            <Button
              variant="default"
              size="sm"
              onClick={onGenerateCVClick}
              className="h-8 gap-1.5 text-xs font-semibold cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 flex-1 sm:flex-initial"
            >
              <FileText className="h-3.5 w-3.5" />
              Generar CV ATS
            </Button>
          )}
          {onUpdateClick && (
            <Button
              variant="outline"
              size="sm"
              onClick={onUpdateClick}
              className="h-8 gap-1.5 text-xs text-foreground border-border hover:bg-muted cursor-pointer flex-1 sm:flex-initial"
            >
              <UploadCloud className="h-3.5 w-3.5 text-muted-foreground" />
              Actualizar
            </Button>
          )}
        </div>
      </div>

      <div className="pt-2 flex items-center justify-between text-xs">
        <span className="text-muted-foreground font-medium">¿Listo para ver los resultados?</span>

        <div
          className="flex items-center gap-1 text-muted-foreground/50 font-semibold cursor-not-allowed select-none"
          title="Diagnóstico (Bloqueado temporalmente)"
        >
          <span>Ver diagnóstico</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  );
}
