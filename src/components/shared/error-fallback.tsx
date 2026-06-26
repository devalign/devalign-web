'use client';

import React from 'react';
import { AlertTriangle, WifiOff, RefreshCw, Home, ServerCrash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorFallbackProps {
  error?: Error | string | null;
  onRetry?: () => void;
  onHome?: () => void;
  fullPage?: boolean;
  title?: string;
  description?: string;
}

function getErrorType(error: Error | string | null | undefined): 'network' | 'server' | 'unknown' {
  const msg = typeof error === 'string' ? error : error?.message || '';
  const lower = msg.toLowerCase();
  if (lower.includes('fetch') || lower.includes('network') || lower.includes('conexión') || lower.includes('timeout') || lower.includes('failed to fetch')) {
    return 'network';
  }
  if (lower.includes('500') || lower.includes('503') || lower.includes('502') || lower.includes('servidor') || lower.includes('server error')) {
    return 'server';
  }
  return 'unknown';
}

export function ErrorFallback({
  error,
  onRetry,
  onHome,
  fullPage,
  title,
  description,
}: ErrorFallbackProps) {
  const errorType = getErrorType(error);
  const errorMessage = typeof error === 'string' ? error : error?.message;

  const config = {
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
    unknown: {
      icon: AlertTriangle,
      title: 'Algo salió mal',
      description: 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.',
    },
  };

  const { icon: Icon, title: defaultTitle, description: defaultDescription } = config[errorType];

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

      <div className="flex gap-3">
        {onRetry && (
          <Button onClick={onRetry} className="gap-2 h-10 text-xs font-bold">
            <RefreshCw className="h-4 w-4" />
            Reintentar
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
