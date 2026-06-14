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

export function AffinityRadarChart({ 
  domainAffinities, 
  techSkills, 
  fullName = 'Usuario',
  roleTitle = 'Desarrollador',
  seniority = 'Junior',
  isLoading = false 
}: AffinityRadarChartProps) {
  // DYNAMIC RADAR CHART COORDINATES CALCULATION
  const getRadarPoints = () => {
    let dataVal = 20, backendVal = 20, cloudVal = 20, devopsVal = 20, frontendVal = 20;

    if (domainAffinities && domainAffinities.length > 0) {
      dataVal = Math.min(20 + (domainAffinities.find(d => d.domain === 'Data')?.affinity_score || 0) * 80, 95);
      backendVal = Math.min(20 + (domainAffinities.find(d => d.domain === 'Backend')?.affinity_score || 0) * 80, 95);
      cloudVal = Math.min(20 + (domainAffinities.find(d => d.domain === 'Cloud')?.affinity_score || 0) * 80, 95);
      devopsVal = Math.min(20 + (domainAffinities.find(d => d.domain === 'DevOps')?.affinity_score || 0) * 80, 95);
      frontendVal = Math.min(20 + (domainAffinities.find(d => d.domain === 'Frontend')?.affinity_score || 0) * 80, 85);
    } else {
      // Fallback
      dataVal = Math.min(35 + techSkills.filter((s) => ['Databricks', 'Spark', 'Hadoop', 'SQL Server'].includes(s)).length * 15, 95);
      backendVal = Math.min(35 + techSkills.filter((s) => ['Python', 'PostgreSQL', 'Microservicios'].includes(s)).length * 20, 95);
      cloudVal = Math.min(20 + techSkills.filter((s) => ['AWS', 'Docker'].includes(s)).length * 35, 95);
      devopsVal = Math.min(20 + techSkills.filter((s) => ['Kubernetes', 'CI/CD'].includes(s)).length * 35, 95);
      frontendVal = Math.min(20 + techSkills.filter((s) => ['React', 'HTML', 'CSS', 'Power BI'].includes(s)).length * 20, 85);
    }

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
