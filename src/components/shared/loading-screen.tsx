import React from 'react';
import { Cpu } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
  className?: string;
  minHeight?: string;
}

export function LoadingScreen({
  message = 'Cargando...',
  className = '',
  minHeight = 'min-h-screen',
}: LoadingScreenProps) {
  return (
    <div className={`w-full flex items-center justify-center bg-background ${minHeight} ${className}`}>
      <div className="flex flex-col items-center gap-4 text-center px-4">
        <div className="relative flex items-center justify-center">
          {/* Glow backdrop matching premium design tokens */}
          <div className="absolute rounded-full bg-primary/15 blur-xl animate-pulse w-12 h-12" />
          <Cpu className="relative h-9 w-9 animate-spin text-primary duration-1000" />
        </div>
        {message && (
          <p className="text-xs text-muted-foreground font-semibold tracking-wide animate-pulse">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
