'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Loader2 } from 'lucide-react';

interface AffinityRadarChartProps {
  techSkills: string[];
  isLoading?: boolean;
}

export function AffinityRadarChart({ techSkills, isLoading = false }: AffinityRadarChartProps) {
  // DYNAMIC RADAR CHART COORDINATES CALCULATION
  const getRadarPoints = () => {
    const dataVal = Math.min(
      35 +
        techSkills.filter((s) => ['Databricks', 'Spark', 'Hadoop', 'SQL Server'].includes(s))
          .length *
          15,
      95,
    );
    const backendVal = Math.min(
      35 +
        techSkills.filter((s) => ['Python', 'PostgreSQL', 'Microservicios'].includes(s)).length *
          20,
      95,
    );
    const cloudVal = Math.min(
      20 + techSkills.filter((s) => ['AWS', 'Docker'].includes(s)).length * 35,
      95,
    );
    const devopsVal = Math.min(
      20 + techSkills.filter((s) => ['Kubernetes', 'CI/CD'].includes(s)).length * 35,
      95,
    );
    const frontendVal = Math.min(
      20 + techSkills.filter((s) => ['React', 'HTML', 'CSS', 'Power BI'].includes(s)).length * 20,
      85,
    );

    const convert = (val: number, angleDeg: number) => {
      const angleRad = (angleDeg - 90) * (Math.PI / 180);
      const r = (val / 100) * 80; // Map 100% to 80px radius
      const x = 100 + r * Math.cos(angleRad);
      const y = 100 + r * Math.sin(angleRad);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    };

    return {
      user: [
        convert(backendVal, 0), // Backend
        convert(frontendVal, 72), // Frontend
        convert(cloudVal, 144), // Cloud
        convert(devopsVal, 216), // DevOps
        convert(dataVal, 288), // Data
      ].join(' '),
      market: [
        convert(92, 0), // Backend market demand
        convert(42, 72), // Frontend market demand
        convert(78, 144), // Cloud market demand
        convert(64, 216), // DevOps market demand
        convert(64, 288), // Data market demand
      ].join(' '),
    };
  };

  const radarPoints = getRadarPoints();

  return (
    <Card className="shadow-lg shadow-black/5 border-border bg-card relative overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-xs z-10 flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
          <p className="text-[9px] font-bold font-mono text-muted-foreground animate-pulse">
            Recalculando afinidad...
          </p>
        </div>
      )}

      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          <CardTitle className="text-xs font-extrabold text-foreground uppercase tracking-wider">
            Afinidad Técnica por Dominio
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex justify-center py-4">
        <div className="relative w-full max-w-[280px] aspect-square">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 200 200">
            {/* Background rings */}
            {[20, 40, 60, 80, 100].map((r) => {
              const rad = (r / 100) * 80;
              const points = [0, 72, 144, 216, 288]
                .map((angle) => {
                  const a = (angle - 90) * (Math.PI / 180);
                  return `${100 + rad * Math.cos(a)},${100 + rad * Math.sin(a)}`;
                })
                .join(' ');
              return (
                <polygon
                  key={r}
                  points={points}
                  className="fill-none stroke-border/40 stroke-1"
                />
              );
            })}

            {/* Axis lines */}
            {[0, 72, 144, 216, 288].map((angle) => {
              const a = (angle - 90) * (Math.PI / 180);
              return (
                <line
                  key={angle}
                  x1={100}
                  y1={100}
                  x2={100 + 80 * Math.cos(a)}
                  y2={100 + 80 * Math.sin(a)}
                  className="stroke-border/40 stroke-1"
                />
              );
            })}

            {/* Labels */}
            <text x={100} y={8} textAnchor="middle" className="fill-muted-foreground text-[8px] font-bold font-mono">BACKEND</text>
            <text x={186} y={75} textAnchor="start" className="fill-muted-foreground text-[8px] font-bold font-mono">FRONTEND</text>
            <text x={156} y={192} textAnchor="start" className="fill-muted-foreground text-[8px] font-bold font-mono">CLOUD</text>
            <text x={44} y={192} textAnchor="end" className="fill-muted-foreground text-[8px] font-bold font-mono">DEVOPS</text>
            <text x={14} y={75} textAnchor="end" className="fill-muted-foreground text-[8px] font-bold font-mono">DATA</text>

            {/* Market and User polygons */}
            <polygon points={radarPoints.market} className="fill-slate-800/10 stroke-slate-500/50 stroke-1.5" />
            <polygon points={radarPoints.user} className="fill-primary/25 stroke-primary stroke-2 transition-all duration-300" />

            {/* Market dots */}
            {radarPoints.market.split(' ').map((p, idx) => {
              const [x, y] = p.split(',');
              return <circle key={idx} cx={x} cy={y} r={2.5} className="fill-slate-500" />;
            })}

            {/* User dots */}
            {radarPoints.user.split(' ').map((p, idx) => {
              const [x, y] = p.split(',');
              return <circle key={idx} cx={x} cy={y} r={3} className="fill-primary stroke-card stroke-1" />;
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
