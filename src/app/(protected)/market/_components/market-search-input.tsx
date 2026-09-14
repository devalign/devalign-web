'use client';

import * as React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

export interface MarketSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  resultCount?: number;
  className?: string;
}

/**
 * Compact search input for filtering clusters by title and key skills.
 */
export function MarketSearchInput({
  value,
  onChange,
  onClear,
  resultCount,
  className,
}: MarketSearchInputProps) {
  const isSearching = value.trim().length > 0;

  return (
    <div className={cn('relative w-full max-w-md', className)}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
        <Search className="w-4 h-4" />
      </div>

      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar por especialidad o tecnología (ej. Python, React)..."
        className="pl-9 pr-20 h-9 text-xs sm:text-sm bg-card border-border/80 focus-visible:ring-primary/20 rounded-xl"
      />

      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
        {isSearching && (
          <>
            {resultCount !== undefined && (
              <span className="text-[10px] font-bold text-muted-foreground bg-secondary/80 px-1.5 py-0.5 rounded-md border border-border/40">
                {resultCount} {resultCount === 1 ? 'resultado' : 'resultados'}
              </span>
            )}
            <button
              type="button"
              onClick={onClear}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
