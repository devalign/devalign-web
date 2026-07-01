'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Info, X } from 'lucide-react';

interface GraphLegendProps {
  counts?: {
    acquired: number;
    gap: number;
    neutral: number;
  };
}

export function GraphLegend({ counts }: GraphLegendProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const media = window.matchMedia('(max-width: 767px)');
      const handleResize = () => {
        setIsMobile(media.matches);
      };
      const timeoutId = setTimeout(handleResize, 0);

      const listener = (e: MediaQueryListEvent) => {
        setIsMobile(e.matches);
        if (!e.matches) setIsOpen(false); // Close popover if resizing to desktop
      };
      media.addEventListener('change', listener);
      return () => {
        clearTimeout(timeoutId);
        media.removeEventListener('change', listener);
      };
    }
  }, []);

  // Click outside to close mobile popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const items = [
    {
      label: counts ? `Habilidad Adquirida (${counts.acquired})` : 'Habilidad Adquirida',
      colorClass: 'bg-success shadow-[0_0_8px_rgba(22,163,74,0.5)]',
    },
    {
      label: counts ? `Brecha / Faltante (${counts.gap})` : 'Brecha / Faltante',
      colorClass: 'bg-warning shadow-[0_0_8px_rgba(249,115,22,0.5)]',
    },
    {
      label: counts ? `Relacionada (${counts.neutral})` : 'Relacionada',
      colorClass: 'bg-info shadow-[0_0_8px_rgba(99,102,241,0.5)]',
    },
  ];

  if (isMobile) {
    return (
      <div ref={popoverRef} className="absolute top-4 left-4 z-25 pointer-events-auto">
        {/* Mobile floating toggle button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border/40 bg-background/80 backdrop-blur-xl hover:bg-background/90 shadow-md cursor-pointer transition-all duration-200"
          title="Ver leyenda del grafo"
        >
          {isOpen ? <X className="h-4 w-4 text-foreground" /> : <Info className="h-4 w-4 text-foreground" />}
        </button>

        {/* Mobile popover content */}
        {isOpen && (
          <div className="absolute top-11 left-0 flex flex-col gap-2 rounded-xl bg-card border border-border/50 p-3 text-xs text-muted-foreground shadow-2xl w-48 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${item.colorClass}`} />
                  <span className="font-semibold text-[11px] text-foreground/90">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop static view
  return (
    <div className="absolute bottom-20 lg:bottom-4 left-4 z-10 flex flex-col gap-2 rounded-lg bg-background/60 p-3 text-xs text-muted-foreground backdrop-blur-md border border-border/40 shadow-xs pointer-events-auto">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span className={`h-3 w-3 rounded-full shrink-0 ${item.colorClass}`} />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
