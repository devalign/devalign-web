'use client';

import React from 'react';
import { Info } from 'lucide-react';
import type { DomainAffinityItem } from '@/lib/api/types';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AffinityRadarProps {
  domainAffinities?: DomainAffinityItem[];
  isLoading?: boolean;
  className?: string;
}

const DOMAIN_CONFIGS = [
  { key: 'Backend', label: 'BACKEND' },
  { key: 'Frontend', label: 'FRONTEND' },
  { key: 'Mobile', label: 'MOBILE' },
  { key: 'QA', label: 'QA' },
  { key: 'DevOps', label: 'DEVOPS' },
  { key: 'Cloud', label: 'CLOUD' },
  { key: 'Data', label: 'DATA' },
];

const DEFAULT_MARKET_DEMAND: Record<string, number> = {
  Backend: 92,
  Frontend: 42,
  Mobile: 45,
  QA: 55,
  DevOps: 64,
  Cloud: 78,
  Data: 64,
};

export function AffinityRadar({
  domainAffinities,
  isLoading = false,
  className,
}: AffinityRadarProps) {
  const getScore = (key: string): number => {
    const affinity = domainAffinities?.find((d) => d.domain.toLowerCase() === key.toLowerCase());
    const rawScore = affinity?.affinity_score || 0;
    return Math.min(20 + rawScore * 80, 100);
  };

  const getMarketDemand = (key: string): number => {
    const affinity = domainAffinities?.find((d) => d.domain.toLowerCase() === key.toLowerCase());
    if (affinity?.market_demand !== undefined) {
      return Math.min(100, Math.round(affinity.market_demand * 100));
    }
    return Math.min(100, DEFAULT_MARKET_DEMAND[key] || 50);
  };

  const convert = (val: number, angleDeg: number) => {
    const angleRad = (angleDeg - 90) * (Math.PI / 180);
    const r = (val / 100) * 80;
    const x = 100 + r * Math.cos(angleRad);
    const y = 100 + r * Math.sin(angleRad);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  };

  const userPoints = DOMAIN_CONFIGS.map((config, index) => {
    const angle = (index * 360) / DOMAIN_CONFIGS.length;
    return convert(getScore(config.key), angle);
  }).join(' ');

  const marketPoints = DOMAIN_CONFIGS.map((config, index) => {
    const angle = (index * 360) / DOMAIN_CONFIGS.length;
    return convert(getMarketDemand(config.key), angle);
  }).join(' ');

  return (
    <TooltipProvider delayDuration={150}>
      <div className={cn('relative flex flex-col gap-6 w-full overflow-visible', className)}>
        {isLoading && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-xs z-10 flex items-center justify-center rounded-2xl">
            <div className="flex flex-col items-center gap-2">
              <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <p className="text-[9px] font-bold font-mono text-muted-foreground animate-pulse">
                Recalculando...
              </p>
            </div>
          </div>
        )}

        {/* Header with Title and Tooltip */}
        <div className="flex gap-1.5 mb-3 relative z-30">
          <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">
            Afinidad por Dominio
          </span>
          <div className="group relative">
            <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground cursor-help transition-colors" />
            <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-52 rounded-md border border-border bg-card p-2 text-[10px] leading-relaxed text-muted-foreground opacity-0 shadow-xl transition-all group-hover:opacity-100 z-50 normal-case font-normal">
              Muestra tu nivel de afinidad con los principales dominios tecnológicos del desarrollo de
              software.
            </div>
          </div>
        </div>

        {/* Radar SVG */}
        <div className="relative w-full max-w-[300px] aspect-square overflow-visible mx-auto">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 200 200">
            {[20, 40, 60, 80, 100].map((r) => {
              const rad = (r / 100) * 80;
              const points = DOMAIN_CONFIGS.map((_, index) => {
                const angle = (index * 360) / DOMAIN_CONFIGS.length;
                const a = (angle - 90) * (Math.PI / 180);
                return `${100 + rad * Math.cos(a)},${100 + rad * Math.sin(a)}`;
              }).join(' ');
              return (
                <polygon key={r} points={points} className="fill-none stroke-border/40 stroke-1" />
              );
            })}

            {DOMAIN_CONFIGS.map((_, index) => {
              const angle = (index * 360) / DOMAIN_CONFIGS.length;
              const a = (angle - 90) * (Math.PI / 180);
              return (
                <line
                  key={index}
                  x1={100}
                  y1={100}
                  x2={100 + 80 * Math.cos(a)}
                  y2={100 + 80 * Math.sin(a)}
                  className="stroke-border/40 stroke-1"
                />
              );
            })}

            {DOMAIN_CONFIGS.map((config, index) => {
              const angle = (index * 360) / DOMAIN_CONFIGS.length;
              const angleRad = (angle - 90) * (Math.PI / 180);
              const r = 94;
              const x = 100 + r * Math.cos(angleRad);
              const y = 100 + r * Math.sin(angleRad);
              let anchor: 'start' | 'end' | 'middle' = 'middle';
              if (x > 105) anchor = 'start';
              else if (x < 95) anchor = 'end';
              let dy = '0.35em';
              if (y < 30) dy = '0';
              else if (y > 175) dy = '0.7em';
              return (
                <text
                  key={config.key}
                  x={x}
                  y={y}
                  dy={dy}
                  textAnchor={anchor}
                  className="fill-muted-foreground text-[7px] font-bold font-mono"
                >
                  {config.label}
                </text>
              );
            })}

            <polygon
              points={marketPoints}
              fill="hsl(var(--muted-foreground))"
              fillOpacity={0.08}
              className="stroke-muted-foreground/30 stroke-1.5"
            />
            <polygon
              points={userPoints}
              fill="hsl(var(--primary))"
              fillOpacity={0.25}
              className="stroke-primary stroke-2"
            />

            {/* Market Dots with Tooltips */}
            {DOMAIN_CONFIGS.map((config, index) => {
              const angle = (index * 360) / DOMAIN_CONFIGS.length;
              const demand = getMarketDemand(config.key);
              const pt = convert(demand, angle);
              const [x, y] = pt.split(',');
              return (
                <Tooltip key={`market-${config.key}`}>
                  <TooltipTrigger asChild>
                    <g className="cursor-pointer group/market-dot">
                      {/* Larger invisible circle for easier hovering */}
                      <circle cx={x} cy={y} r={7} className="fill-transparent stroke-none" />
                      <circle
                        cx={x}
                        cy={y}
                        r={2.5}
                        className="fill-slate-500 transition-all duration-200 group-hover/market-dot:r-[4]"
                      />
                    </g>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="font-mono text-[9px] py-1 px-2 bg-slate-900 border border-slate-800 text-slate-100">
                    <span className="font-bold text-slate-400">{config.label}</span>
                    <div className="mt-0.5 text-slate-300">Mercado: <span className="font-bold text-slate-100">{demand}%</span></div>
                  </TooltipContent>
                </Tooltip>
              );
            })}

            {/* User Dots with Tooltips */}
            {DOMAIN_CONFIGS.map((config, index) => {
              const angle = (index * 360) / DOMAIN_CONFIGS.length;
              const score = getScore(config.key);
              const affinity = domainAffinities?.find((d) => d.domain.toLowerCase() === config.key.toLowerCase());
              const displayPercentage = affinity?.affinity_score !== undefined
                ? Math.round(affinity.affinity_score * 100)
                : 0;

              const pt = convert(score, angle);
              const [x, y] = pt.split(',');
              return (
                <Tooltip key={`user-${config.key}`}>
                  <TooltipTrigger asChild>
                    <g className="cursor-pointer group/user-dot">
                      {/* Larger invisible circle for easier hovering */}
                      <circle cx={x} cy={y} r={7} className="fill-transparent stroke-none" />
                      <circle
                        cx={x}
                        cy={y}
                        r={3}
                        className="fill-primary stroke-card stroke-1 transition-all duration-200 group-hover/user-dot:r-[4.5] group-hover/user-dot:stroke-primary-foreground"
                      />
                    </g>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="font-mono text-[9px] py-1 px-2 bg-slate-900 border border-slate-800 text-slate-100">
                    <span className="font-bold text-primary">{config.label}</span>
                    <div className="mt-0.5 text-slate-300">Tu Perfil: <span className="font-bold text-slate-100">{displayPercentage}%</span></div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 text-[9px] font-mono text-muted-foreground mb-6">
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
            <span>Mercado</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span>Tu Perfil</span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
