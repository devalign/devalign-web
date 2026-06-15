'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, Loader2, User, Settings2 } from 'lucide-react';

interface AffinityRadarChartProps {
  domainAffinities?: { domain: string; affinity_score: number }[];
  techSkills: string[];
  fullName?: string;
  roleTitle?: string;
  seniority?: string;
  isLoading?: boolean;
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
  fullName = 'Usuario',
  roleTitle = 'Desarrollador',
  seniority = 'Junior',
  isLoading = false,
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

      let val = 20;
      if (domainAffinities && domainAffinities.length > 0) {
        val = Math.min(20 + score * 80, 95);
      } else {
        // Fallback calculations using techSkills
        const skillsLower = techSkills.map((s) => s.toLowerCase());
        if (config.key === 'Backend') {
          val = Math.min(
            35 +
              skillsLower.filter((s) =>
                ['python', 'postgresql', 'microservicios', 'java', 'springboot', 'c#', 'net'].some(
                  (k) => s.includes(k),
                ),
              ).length *
                20,
            95,
          );
        } else if (config.key === 'Frontend') {
          val = Math.min(
            20 +
              skillsLower.filter((s) =>
                ['react', 'html', 'css', 'javascript', 'typescript', 'vue', 'angular'].some((k) =>
                  s.includes(k),
                ),
              ).length *
                20,
            85,
          );
        } else if (config.key === 'Cloud') {
          val = Math.min(
            20 +
              skillsLower.filter((s) =>
                ['aws', 'docker', 'azure', 'gcp'].some((k) => s.includes(k)),
              ).length *
                35,
            95,
          );
        } else if (config.key === 'DevOps') {
          val = Math.min(
            20 +
              skillsLower.filter((s) =>
                ['kubernetes', 'ci/cd', 'terraform', 'jenkins', 'actions'].some((k) =>
                  s.includes(k),
                ),
              ).length *
                35,
            95,
          );
        } else if (config.key === 'Data') {
          val = Math.min(
            35 +
              skillsLower.filter((s) =>
                ['databricks', 'spark', 'hadoop', 'sql', 'mysql', 'snowflake', 'airflow'].some(
                  (k) => s.includes(k),
                ),
              ).length *
                15,
            95,
          );
        } else if (config.key === 'QA') {
          val = Math.min(
            20 +
              skillsLower.filter((s) =>
                ['qa', 'selenium', 'cypress', 'playwright', 'testing', 'junit'].some((k) =>
                  s.includes(k),
                ),
              ).length *
                25,
            95,
          );
        } else if (config.key === 'Mobile') {
          val = Math.min(
            20 +
              skillsLower.filter((s) =>
                ['flutter', 'react native', 'swift', 'kotlin', 'android', 'ios'].some((k) =>
                  s.includes(k),
                ),
              ).length *
                35,
            95,
          );
        }
      }

      const angle = (index * 360) / DOMAIN_CONFIGS.length;
      return convert(val, angle);
    });

    const marketPoints = DOMAIN_CONFIGS.map((config, index) => {
      const angle = (index * 360) / DOMAIN_CONFIGS.length;
      return convert(config.marketDemand, angle);
    });

    return {
      user: userPoints.join(' '),
      market: marketPoints.join(' '),
    };
  };

  const radarPoints = getRadarPoints();

  return (
    <Card className="shadow-lg shadow-black/5 border-border bg-card relative overflow-hidden flex flex-col h-full">
      <div className="h-2 bg-gradient-to-r from-primary/30 via-primary to-primary/60 shrink-0" />

      {isLoading && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-xs z-10 flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
          <p className="text-[9px] font-bold font-mono text-muted-foreground animate-pulse">
            Recalculando afinidad...
          </p>
        </div>
      )}

      {/* Cabecera Perfil */}
      <div className="p-5 pb-3 flex justify-between items-start gap-4 border-b border-border/50">
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 text-primary rounded-lg shrink-0">
              <User className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-bold font-mono bg-secondary text-foreground uppercase">
              {seniority}
            </span>
          </div>
          <h2 className="text-lg font-bold tracking-tight text-foreground truncate mt-1">
            {fullName}
          </h2>
          <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
            {roleTitle}
          </p>
        </div>

        <div className="shrink-0">
          <Link href="/profile">
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:bg-primary/10 text-[10px] h-7 cursor-pointer gap-1 px-2"
            >
              <Settings2 className="w-3 h-3" />
              Ajustar
            </Button>
          </Link>
        </div>
      </div>

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
      <CardContent className="flex justify-center py-4 flex-1 items-center">
        <div className="relative w-full max-w-[280px] aspect-square">
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
              // Radius for labels is 94px from center (100, 100)
              const r = 94;
              const x = 100 + r * Math.cos(angleRad);
              const y = 100 + r * Math.sin(angleRad);

              // Text anchor adjustment based on side of the radar
              let anchor: 'start' | 'end' | 'middle' = 'middle';
              if (x > 105) anchor = 'start';
              else if (x < 95) anchor = 'end';

              // Slight vertical adjustment for text alignment
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
              className="fill-slate-800/10 stroke-slate-500/50 stroke-1.5"
            />
            <polygon
              points={radarPoints.user}
              className="fill-primary/25 stroke-primary stroke-2 transition-all duration-300"
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
                <circle
                  key={idx}
                  cx={x}
                  cy={y}
                  r={3}
                  className="fill-primary stroke-card stroke-1"
                />
              );
            })}
          </svg>

          <div className="absolute -bottom-6 left-0 right-0 flex justify-center gap-4 text-[9px] font-mono text-muted-foreground">
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
      </CardContent>
    </Card>
  );
}
