'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Loader2 } from 'lucide-react';
import type { DomainAffinityItem } from '@/lib/api/types';

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

export function AffinityRadarChart({
  domainAffinities,
  techSkills,
  isLoading = false,
  standalone = true,
  className,
}: AffinityRadarChartProps) {
  // DYNAMIC RADAR CHART COORDINATES CALCULATION
  const getRadarPoints = () => {
    const convert = (val: number, angleDeg: number) => {
      const angleRad = (angleDeg - 90) * (Math.PI / 180);
      const r = (val / 100) * 80; // Map 100% to 80px radius
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
        <CardHeader className="pb-0 pt-4">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            <CardTitle className="text-[10px] font-extrabold text-foreground uppercase tracking-wider">
              Afinidad Técnica por Dominio
            </CardTitle>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">
            Basado en el análisis de 600 ofertas reales.
          </p>
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
            Basado en el análisis de 600 ofertas reales.
          </p>
        </div>
      )}

      {standalone ? (
        <CardContent className="flex justify-center py-4 flex-1 items-center">
          {renderRadarSVG()}
        </CardContent>
      ) : (
        <div className="flex justify-center py-4 flex-1 items-center px-6 min-h-0">
          {renderRadarSVG()}
        </div>
      )}
    </>
  );

  const renderRadarSVG = () => (
    <div className="relative w-full max-w-[290px] sm:max-w-[380px] md:max-w-[420px] aspect-square my-4 mx-auto">
      <svg className="w-full h-full overflow-visible" viewBox="0 0 200 200">
        {/* Background rings */}
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

        {/* Axis lines */}
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

        {/* Dynamic Labels */}
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

        {/* Market and User polygons */}
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

        {/* Market dots */}
        {radarPoints.market.split(' ').map((p, idx) => {
          const [x, y] = p.split(',');
          return <circle key={idx} cx={x} cy={y} r={2.5} className="fill-slate-500" />;
        })}

        {/* User dots */}
        {radarPoints.user.split(' ').map((p, idx) => {
          const [x, y] = p.split(',');
          return (
            <circle key={idx} cx={x} cy={y} r={3} className="fill-primary stroke-card stroke-1" />
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

  if (standalone) {
    return (
      <Card
        className={`card-glass relative overflow-hidden flex flex-col h-full ${className || ''}`}
      >
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
