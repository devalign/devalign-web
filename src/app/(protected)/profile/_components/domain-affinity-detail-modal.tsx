'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Target, Info } from 'lucide-react';
import type { DomainAffinityItem } from '@/types/diagnosis';
import { cn } from '@/lib/utils';

interface DomainAffinityDetailModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  domainAffinities?: DomainAffinityItem[];
}

const DOMAIN_CONFIGS = [
  { key: 'Backend', label: 'BACKEND', marketDemand: 92 },
  { key: 'Frontend', label: 'FRONTEND', marketDemand: 42 },
  { key: 'Mobile', label: 'MOBILE', marketDemand: 45 },
  { key: 'QA', label: 'QA', marketDemand: 55 },
  { key: 'DevOps', label: 'DEVOPS', marketDemand: 64 },
  { key: 'Cloud', label: 'CLOUD', marketDemand: 78 },
  { key: 'Data', label: 'DATA', marketDemand: 64 },
];

const DOMAIN_COLORS: Record<string, string> = {
  Backend: 'hsl(var(--domain-backend))',
  Frontend: 'hsl(var(--domain-frontend))',
  Mobile: 'hsl(var(--info))',
  QA: 'hsl(var(--warning))',
  DevOps: 'hsl(var(--domain-devops))',
  Cloud: 'hsl(var(--domain-cloud))',
  Data: 'hsl(var(--domain-data))',
};

export function DomainAffinityDetailModal({
  isOpen,
  onOpenChange,
  domainAffinities,
}: DomainAffinityDetailModalProps) {
  const [animated, setAnimated] = useState(false);
  const [tooltipData, setTooltipData] = useState<{
    key: string;
    userScore: number;
    marketDemand: number;
    gap: number;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => setAnimated(true), 150);
      return () => clearTimeout(t);
    } else {
      setAnimated(false);
    }
  }, [isOpen]);

  const domainData = DOMAIN_CONFIGS.map((config) => {
    const affinity = domainAffinities?.find(
      (d) => d.domain.toLowerCase() === config.key.toLowerCase(),
    );
    const rawScore = affinity?.affinity_score || 0;
    const userScore = Math.min(20 + rawScore * 80, 95);
    const marketDemand =
      affinity?.market_demand !== undefined
        ? Math.round(affinity.market_demand * 100)
        : config.marketDemand;
    return {
      key: config.key,
      label: config.label,
      userScore: Math.round(userScore),
      marketDemand,
      gap: Math.round(userScore) - marketDemand,
    };
  }).sort((a, b) => b.userScore - a.userScore); // Sort by highest user score for better presentation in modal

  const gapColorClass = (gap: number) => {
    if (gap < -5) return 'text-destructive';
    if (gap <= 5) return 'text-warning';
    return 'text-success';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] border-border bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-md font-bold text-foreground">
            <Target className="w-5 h-5 text-primary shrink-0" />
            Detalle de Afinidad por Dominio
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Comparativa detallada de tu nivel de afinidad actual en cada dominio contra la demanda real del mercado laboral.
          </DialogDescription>
        </DialogHeader>

        <div className="w-full px-1 py-3 mt-2">
          {/* Table header */}
          <div className="grid grid-cols-[1.2fr_1.5fr_auto_auto] gap-x-4 gap-y-1 text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider mb-3 px-2">
            <span>Dominio</span>
            <span>Tu perfil</span>
            <span>Mercado</span>
            <span className="text-right">Brecha</span>
          </div>

          {/* Table rows */}
          <div className="space-y-1">
            {domainData.map((d) => (
              <div
                key={d.key}
                className={cn(
                  'relative grid grid-cols-[1.2fr_1.5fr_auto_auto] gap-x-4 gap-y-1 items-center px-2 py-2.5 rounded-lg transition-colors group',
                  'hover:bg-secondary/20',
                )}
                onMouseEnter={() => setTooltipData(d)}
                onMouseLeave={() => setTooltipData(null)}
              >
                {/* Dominio */}
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: DOMAIN_COLORS[d.key] || 'hsl(var(--primary))' }}
                  />
                  <span className="text-xs font-bold text-foreground truncate">{d.label}</span>
                </div>

                {/* Tu perfil — percentage + bar */}
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[11px] font-black text-foreground shrink-0 w-8 text-left tabular-nums">
                    {d.userScore}%
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-secondary/40 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: animated ? `${d.userScore}%` : '0%',
                        backgroundColor: DOMAIN_COLORS[d.key] || 'hsl(var(--primary))',
                      }}
                    />
                  </div>
                </div>

                {/* Mercado */}
                <span className="text-[11px] font-semibold text-muted-foreground tabular-nums">
                  {d.marketDemand}%
                </span>

                {/* Gap */}
                <span
                  className={cn('text-[11px] font-bold tabular-nums text-right min-w-[45px]', gapColorClass(d.gap))}
                >
                  {d.gap > 0 ? '+' : ''}
                  {d.gap}%
                </span>

                {/* Tooltip */}
                {tooltipData?.key === d.key && (
                  <div className="absolute left-1/2 -translate-x-1/2 -top-1 translate-y-[-100%] z-20 pointer-events-none">
                    <div className="bg-card border border-border rounded-lg shadow-lg px-3 py-2 text-[10px] space-y-0.5 whitespace-nowrap">
                      <p className="font-bold text-foreground">{d.key}</p>
                      <p>
                        Tu perfil: <span className="font-semibold text-foreground">{d.userScore}%</span>
                      </p>
                      <p>
                        Mercado:{' '}
                        <span className="font-semibold text-foreground">{d.marketDemand}%</span>
                      </p>
                      <p>
                        Brecha:{' '}
                        <span className={cn('font-semibold', gapColorClass(d.gap))}>
                          {d.gap > 0 ? '+' : ''}
                          {d.gap}%
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-start gap-2 bg-secondary/10 p-3 rounded-lg border border-border mt-5">
            <Info className="h-4 w-4 text-info shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              La <strong>Brecha</strong> indica la diferencia entre tu afinidad y la demanda del mercado. Un valor positivo significa que superas la demanda promedio, mientras que uno negativo señala un área de oportunidad para mejorar mediante la adquisición de nuevas competencias.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
