import React from 'react';

export function GraphLegend() {
  return (
    <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-2 rounded-lg bg-background/60 p-3 text-xs text-muted-foreground backdrop-blur-md border border-border/40 shadow-xs">
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-success shadow-[0_0_8px_rgba(22,163,74,0.5)]" />
        <span>Habilidad Adquirida</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-warning shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
        <span>Brecha / Faltante</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-info shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
        <span>Relacionada</span>
      </div>
    </div>
  );
}
