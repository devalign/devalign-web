'use client';

import React from 'react';
import { Target } from 'lucide-react';
import type { DomainAffinityItem } from '@/lib/api/types';
import { cn } from '@/lib/utils';

interface SimpleAffinityRadarProps {
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

export function SimpleAffinityRadar({
  domainAffinities,
  isLoading = false,
  className,
}: SimpleAffinityRadarProps) {
  const getScore = (key: string): number => {
    const affinity = domainAffinities?.find((d) => d.domain.toLowerCase() === key.toLowerCase());
    const rawScore = affinity?.affinity_score || 0;
    return Math.min(20 + rawScore * 80, 95);
  };

  const getMarketDemand = (key: string): number => {
    const affinity = domainAffinities?.find((d) => d.domain.toLowerCase() === key.toLowerCase());
    if (affinity?.market_demand !== undefined) {
      return Math.round(affinity.market_demand * 100);
    }
    return DEFAULT_MARKET_DEMAND[key] || 50;
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
    <div className={cn('relative flex flex-col items-center w-full', className)}>
      {isLoading && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-xs z-10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <p className="text-[9px] font-bold font-mono text-muted-foreground animate-pulse">
              Recalculando...
            </p>
          </div>
        </div>
      )}

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

      <div className="relative w-full max-w-[260px] aspect-square">
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

          {marketPoints.split(' ').map((p, i) => {
            const [x, y] = p.split(',');
            return <circle key={i} cx={x} cy={y} r={2.5} className="fill-slate-500" />;
          })}

          {userPoints.split(' ').map((p, i) => {
            const [x, y] = p.split(',');
            return (
              <circle key={i} cx={x} cy={y} r={3} className="fill-primary stroke-card stroke-1" />
            );
          })}
        </svg>
      </div>
    </div>
  );
}
