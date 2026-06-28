'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Loader2, BarChart3, Radar } from 'lucide-react';
import type { DomainAffinityItem } from '@/lib/api/types';
import { cn } from '@/lib/utils';

interface AffinityRadarChartProps {
  domainAffinities?: DomainAffinityItem[];
  techSkills?: string[];
  isLoading?: boolean;
  standalone?: boolean;
  className?: string;
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

export function AffinityRadarChart({
  domainAffinities,
  isLoading = false,
  standalone = true,
  className,
}: AffinityRadarChartProps) {
  const [viewMode, setViewMode] = useState<'radar' | 'detail'>('radar');
  const [animated, setAnimated] = useState(false);
  const [tooltipData, setTooltipData] = useState<{
    key: string;
    userScore: number;
    marketDemand: number;
    gap: number;
  } | null>(null);

  const switchToDetail = () => {
    setViewMode('detail');
    setAnimated(false);
  };

  const switchToRadar = () => {
    setViewMode('radar');
  };

  useEffect(() => {
    if (viewMode === 'detail') {
      const t = setTimeout(() => setAnimated(true), 80);
      return () => clearTimeout(t);
    }
  }, [viewMode]);

  const getRadarPoints = () => {
    const convert = (val: number, angleDeg: number) => {
      const angleRad = (angleDeg - 90) * (Math.PI / 180);
      const r = (val / 100) * 80;
      const x = 100 + r * Math.cos(angleRad);
      const y = 100 + r * Math.sin(angleRad);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    };

    const userPoints = DOMAIN_CONFIGS.map((config, index) => {
      const score =
        domainAffinities?.find((d) => d.domain.toLowerCase() === config.key.toLowerCase())
          ?.affinity_score || 0;
      const val = Math.min(20 + score * 80, 95);
      const angle = (index * 360) / DOMAIN_CONFIGS.length;
      return convert(val, angle);
    });

    const marketPoints = DOMAIN_CONFIGS.map((config, index) => {
      const dbDemand = domainAffinities?.find(
        (d) => d.domain.toLowerCase() === config.key.toLowerCase(),
      )?.market_demand;
      const demandVal = dbDemand !== undefined ? Math.round(dbDemand * 100) : config.marketDemand;
      const angle = (index * 360) / DOMAIN_CONFIGS.length;
      return convert(demandVal, angle);
    });

    return {
      user: userPoints.join(' '),
      market: marketPoints.join(' '),
    };
  };

  const radarPoints = getRadarPoints();

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
      gap: marketDemand - Math.round(userScore),
    };
  }).sort((a, b) => a.gap - b.gap);

  const renderRadarSVG = () => (
    <div className="relative w-full max-w-[290px] sm:max-w-[380px] md:max-w-[420px] aspect-square my-4 mx-auto">
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
              className="fill-muted-foreground text-[7.5px] font-bold font-mono"
            >
              {config.label}
            </text>
          );
        })}

        <polygon
          points={radarPoints.market}
          fill="hsl(var(--muted-foreground))"
          fillOpacity={0.08}
          className="stroke-muted-foreground/30 stroke-1.5"
        />
        <polygon
          points={radarPoints.user}
          fill="hsl(var(--primary))"
          fillOpacity={0.25}
          className="stroke-primary stroke-2 transition-all duration-300"
        />

        {radarPoints.market.split(' ').map((p, i) => {
          const [x, y] = p.split(',');
          return <circle key={i} cx={x} cy={y} r={2.5} className="fill-slate-500" />;
        })}

        {radarPoints.user.split(' ').map((p, i) => {
          const [x, y] = p.split(',');
          return (
            <circle key={i} cx={x} cy={y} r={3} className="fill-primary stroke-card stroke-1" />
          );
        })}
      </svg>

      <div className="absolute -bottom-5 left-0 right-0 flex justify-center gap-4 text-[9px] font-mono text-muted-foreground">
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
  );

  const gapColorClass = (gap: number) => {
    if (gap < -5) return 'text-destructive';
    if (gap <= 5) return 'text-warning';
    return 'text-success';
  };

  const renderDetailTable = () => (
    <div className="w-full px-1 py-3">
      {/* Table header */}
      <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-x-3 gap-y-1 text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider mb-2 px-2">
        <span>Dominio</span>
        <span>Tu perfil</span>
        <span>Mercado</span>
        <span>Gap</span>
      </div>

      {/* Table rows */}
      <div className="space-y-0.5">
        {domainData.map((d) => (
          <div
            key={d.key}
            className={cn(
              'relative grid grid-cols-[1fr_1fr_auto_auto] gap-x-3 gap-y-1 items-center px-2 py-2 rounded-lg transition-colors group',
              'hover:bg-secondary/20',
            )}
            onMouseEnter={() => setTooltipData(d)}
            onMouseLeave={() => setTooltipData(null)}
          >
            {/* Dominio */}
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: DOMAIN_COLORS[d.key] || 'hsl(var(--primary))' }}
              />
              <span className="text-xs font-bold text-foreground truncate">{d.label}</span>
            </div>

            {/* Tu perfil — bar + percentage */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex-1 h-2 rounded-full bg-secondary/40 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: animated ? `${d.userScore}%` : '0%',
                    backgroundColor: DOMAIN_COLORS[d.key] || 'hsl(var(--primary))',
                  }}
                />
              </div>
              <span className="text-[10px] font-bold text-foreground shrink-0 w-8 text-right tabular-nums">
                {d.userScore}%
              </span>
            </div>

            {/* Mercado */}
            <span className="text-[10px] font-semibold text-muted-foreground tabular-nums">
              {d.marketDemand}%
            </span>

            {/* Gap */}
            <span
              className={cn('text-[10px] font-black tabular-nums text-right', gapColorClass(d.gap))}
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
    </div>
  );

  const renderContent = () => (
    <>
      {isLoading && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-xs z-10 flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
          <p className="text-[9px] font-bold font-mono text-muted-foreground animate-pulse">
            Recalculando afinidad...
          </p>
        </div>
      )}

      {standalone ? (
        <CardHeader className="pb-2 pt-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-primary shrink-0" />
                <CardTitle className="text-[10px] font-extrabold text-foreground uppercase tracking-wider">
                  Afinidad Técnica por Dominio
                </CardTitle>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                Comparación de tu perfil con la demanda del mercado por dominio técnico.
              </p>
            </div>

            {/* View toggle */}
            <div className="flex rounded-lg border border-border bg-secondary/20 p-0.5 shrink-0">
              <button
                onClick={switchToRadar}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-bold transition-all cursor-pointer',
                  viewMode === 'radar'
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Radar className="w-3 h-3" />
                Vista radar
              </button>
              <button
                onClick={switchToDetail}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-bold transition-all cursor-pointer',
                  viewMode === 'detail'
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <BarChart3 className="w-3 h-3" />
                Vista detalle
              </button>
            </div>
          </div>
        </CardHeader>
      ) : (
        <div className="pb-0 pt-4 px-6 shrink-0">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            <div className="text-[10px] font-extrabold text-foreground uppercase tracking-wider">
              Afinidad Técnica por Dominio
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">
            Comparación de tu perfil con la demanda del mercado por dominio técnico.
          </p>
        </div>
      )}

      {standalone ? (
        <CardContent className="relative flex flex-col flex-1 py-3">
          <div className="relative min-h-[260px]">
            <div
              className={cn(
                'transition-all duration-300',
                viewMode === 'radar'
                  ? 'opacity-100'
                  : 'opacity-0 absolute inset-0 pointer-events-none',
              )}
            >
              {renderRadarSVG()}
            </div>
            <div
              className={cn(
                'transition-all duration-300',
                viewMode === 'detail'
                  ? 'opacity-100'
                  : 'opacity-0 absolute inset-0 pointer-events-none',
              )}
            >
              {renderDetailTable()}
            </div>
          </div>
        </CardContent>
      ) : (
        <div className="flex justify-center py-4 flex-1 items-center px-6 min-h-0">
          {renderRadarSVG()}
        </div>
      )}

      {/* Shared legend */}
      <div className="px-6 pb-4">
        <p className="text-[9px] text-muted-foreground">
          El porcentaje de GAP representa la diferencia entre tu nivel de dominio y la demanda
          promedio del mercado. Cuanto más cercano a 0%, mayor es tu alineación.
        </p>
      </div>
    </>
  );

  if (standalone) {
    return (
      <Card className={`relative overflow-hidden flex flex-col h-full ${className || ''}`}>
        {renderContent()}
      </Card>
    );
  }

  return (
    <div className={`relative flex flex-col h-full w-full min-h-0 ${className || ''}`}>
      {renderContent()}
    </div>
  );
}
