import React from 'react';

export function GraphLoading({ message = 'Cargando red neuronal...' }: { message?: string }) {
  return (
    <div className="flex h-full min-h-[400px] w-full items-center justify-center rounded-xl border border-border/40 bg-background/40 backdrop-blur-md">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
        <p className="text-sm text-muted-foreground font-mono animate-pulse">{message}</p>
      </div>
    </div>
  );
}
