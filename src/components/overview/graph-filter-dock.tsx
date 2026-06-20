'use client';

import React from 'react';
import { Network, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export type FilterMode = 'all' | 'strengths' | 'gaps';

interface GraphFilterDockProps {
  activeFilter: FilterMode;
  onFilterChange: (filter: FilterMode) => void;
}

export function GraphFilterDock({ activeFilter, onFilterChange }: GraphFilterDockProps) {
  const options = [
    {
      id: 'all' as FilterMode,
      label: 'Ver Todo',
      icon: Network,
      colorClass: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/30',
      activeColorClass: 'bg-indigo-500 text-white shadow-indigo-500/30 ring-indigo-500/20',
    },
    {
      id: 'strengths' as FilterMode,
      label: 'Mis Fortalezas',
      icon: CheckCircle2,
      colorClass: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
      activeColorClass: 'bg-emerald-500 text-white shadow-emerald-500/30 ring-indigo-500/20',
    },
    {
      id: 'gaps' as FilterMode,
      label: 'Mis Brechas',
      icon: AlertCircle,
      colorClass: 'text-orange-500 bg-orange-500/10 border-orange-500/30',
      activeColorClass: 'bg-orange-500 text-white shadow-orange-500/30 ring-indigo-500/20',
    },
  ];

  return (
    <TooltipProvider delayDuration={100}>
      <div className="bg-background/60 backdrop-blur-xl border border-border/40 px-3 py-2 rounded-full shadow-2xl flex items-center gap-1.5 pointer-events-auto">
        {/* Filter controls */}
        {options.map((opt) => {
          const isActive = activeFilter === opt.id;
          const Icon = opt.icon;

          return (
            <Tooltip key={opt.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onFilterChange(opt.id)}
                  className={cn(
                    'flex items-center justify-center h-8 w-8 rounded-full transition-all duration-300 ring-2 ring-transparent cursor-pointer',
                    isActive
                      ? cn('shadow-lg ring-offset-2', opt.activeColorClass)
                      : 'text-muted-foreground hover:bg-secondary/40 hover:text-foreground'
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={10} className="text-xs font-bold bg-popover text-popover-foreground border-border/40">
                {opt.label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
