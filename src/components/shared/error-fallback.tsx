'use client';

import React from 'react';
import { AlertTriangle, WifiOff, RefreshCw, Home, ServerCrash, FileWarning, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ErrorCategory = 'network' | 'server' | 'cv_invalid' | 'cv_processing' | 'unknown';

interface ErrorFallbackProps {
  error?: Error | string | null;
  onRetry?: () => void;
  onHome?: () => void;
  onUploadNew?: () => void;
  onViewHistory?: () => void;
  fullPage?: boolean;
  title?: string;
  description?: string;
}

function getErrorCategory(error: Error | string | null | undefined): ErrorCategory {
  const msg = typeof error === 'string' ? error : error?.message || '';
  const lower = msg.toLowerCase();
  if (lower.includes('fetch') || lower.includes('network') || lower.includes('conexión') || lower.includes('timeout') || lower.includes('failed to fetch')) {
    return 'network';
  }
  if (lower.includes('500') || lower.includes('503') || lower.includes('502') || lower.includes('servidor') || lower.includes('server error')) {
    return 'server';
  }
  if (lower.includes('no es un cv') || lower.includes('no es un currículum') || lower.includes('not a valid cv') || lower.includes('not a resume')) {
    return 'cv_invalid';
  }
  if (lower.includes('cv') || lower.includes('currículum') || lower.includes('resume') || lower.includes('extraction') || lower.includes('procesar')) {
    return 'cv_processing';
  }
  return 'unknown';
}

const CATEGORY_CONFIG: Record<ErrorCategory, { icon: typeof WifiOff; title: string; description: string }> = {
  network: {
    icon: WifiOff,
    title: 'Sin conexión al servidor',
    description: 'No pudimos conectar con el servidor de análisis. Verifica tu conexión o inténtalo más tarde.',
  },
  server: {
    icon: ServerCrash,
    title: 'Error del servidor',
    description: 'El servidor de análisis experimentó un problema. Nuestro equipo ha sido notificado.',
  },
  cv_invalid: {
    icon: FileWarning,
    title: 'El archivo no es un CV válido',
    description: 'El documento que subiste no se reconoce como un currículum. Asegúrate de que contenga experiencia laboral, educación y habilidades.',
  },
  cv_processing: {
    icon: AlertTriangle,
    title: 'Error al procesar el CV',
    description: 'Ocurrió un problema durante el análisis de tu currículum. Puedes intentarlo de nuevo o subir otro archivo.',
  },
  unknown: {
    icon: AlertTriangle,
    title: 'Algo salió mal',
    description: 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.',
  },
};

export function ErrorFallback({
  error,
  onRetry,
  onHome,
  onUploadNew,
  onViewHistory,
  fullPage,
  title,
  description,
}: ErrorFallbackProps) {
  const category = getErrorCategory(error);
  const errorMessage = typeof error === 'string' ? error : error?.message;
  const { icon: Icon, title: defaultTitle, description: defaultDescription } = CATEGORY_CONFIG[category];

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-5',
        fullPage ? 'min-h-screen bg-background p-6' : 'py-16 px-4',
      )}
    >
      <div className="rounded-full bg-warning/10 p-4 text-warning">
        <Icon className="h-10 w-10" />
      </div>

      <div className="max-w-md text-center space-y-2">
        <h2 className="text-xl font-black text-foreground tracking-tight">
          {title || defaultTitle}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description || defaultDescription}
        </p>
      </div>

      {errorMessage && (
        <details className="max-w-md w-full">
          <summary className="text-xs text-muted-foreground/60 cursor-pointer hover:text-muted-foreground text-center font-mono">
            Detalles técnicos
          </summary>
          <pre className="mt-2 text-[10px] text-muted-foreground/50 bg-muted/30 rounded-lg p-3 overflow-auto font-mono whitespace-pre-wrap break-all">
            {errorMessage}
          </pre>
        </details>
      )}

      <div className="flex flex-wrap justify-center gap-2">
        {onRetry && (
          <Button onClick={onRetry} className="gap-2 h-10 text-xs font-bold">
            <RefreshCw className="h-4 w-4" />
            Reintentar
          </Button>
        )}
        {onUploadNew && (category === 'cv_invalid' || category === 'cv_processing') && (
          <Button variant="outline" onClick={onUploadNew} className="gap-2 h-10 text-xs font-bold">
            <FileWarning className="h-4 w-4" />
            Subir otro CV
          </Button>
        )}
        {onViewHistory && (category === 'cv_processing' || category === 'unknown') && (
          <Button variant="outline" onClick={onViewHistory} className="gap-2 h-10 text-xs font-bold">
            <History className="h-4 w-4" />
            Ver historial
          </Button>
        )}
        {onHome && (
          <Button variant="outline" onClick={onHome} className="gap-2 h-10 text-xs font-bold">
            <Home className="h-4 w-4" />
            Ir al inicio
          </Button>
        )}
      </div>
    </div>
  );
}
