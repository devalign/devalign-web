'use client';

import React from 'react';
import { ClusterAffinityItem } from '@/lib/api/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, ArrowUpRight } from 'lucide-react';

interface AffinityCardProps {
  primarySpecialty: string;
  alignmentScore: number;
  secondaryAffinities: ClusterAffinityItem[];
}

export default function AffinityCard({
  primarySpecialty,
  alignmentScore,
  secondaryAffinities,
}: AffinityCardProps) {
  const allAffinities = [
    { cluster_name: primarySpecialty, affinity_score: alignmentScore, is_primary: true },
    ...secondaryAffinities.map((a) => ({
      cluster_name: a.cluster_name,
      affinity_score: a.affinity_score,
      is_primary: false,
    })),
  ];

  const domainStyles: Record<string, { barClass: string; textClass: string }> = {
    Backend: {
      barClass: 'bg-emerald-600 dark:bg-emerald-500',
      textClass: 'text-emerald-700 dark:text-emerald-400',
    },
    Cloud: {
      barClass: 'bg-blue-600 dark:bg-blue-500',
      textClass: 'text-blue-700 dark:text-blue-400',
    },
    DevOps: {
      barClass: 'bg-amber-600 dark:bg-amber-500',
      textClass: 'text-amber-700 dark:text-amber-400',
    },
    Frontend: {
      barClass: 'bg-purple-600 dark:bg-purple-500',
      textClass: 'text-purple-700 dark:text-purple-400',
    },
    'Data Engineering': {
      barClass: 'bg-red-600 dark:bg-red-500',
      textClass: 'text-red-700 dark:text-red-400',
    },
  };

  const defaultDomains = ['Backend', 'Cloud', 'DevOps', 'Frontend', 'Data Engineering'];
  const renderedDomains = defaultDomains
    .map((name) => {
      const matched = allAffinities.find((a) =>
        a.cluster_name.toLowerCase().includes(name.toLowerCase()),
      );
      const score = matched
        ? matched.affinity_score
        : name === 'Backend'
          ? 0.92
          : name === 'Cloud'
            ? 0.78
            : name === 'DevOps'
              ? 0.64
              : name === 'Frontend'
                ? 0.42
                : 0.28;
      return {
        name,
        score,
        percentage: Math.round(score * 100),
      };
    })
    .sort((a, b) => b.score - a.score);

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-xs font-bold text-muted-foreground flex items-center gap-2 tracking-wider uppercase">
          <Shield className="h-4 w-4 text-primary" />
          Afinidad con Dominios
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {renderedDomains.map((domain) => {
          const style = domainStyles[domain.name] || {
            barClass: 'bg-primary',
            textClass: 'text-primary',
          };
          return (
            <div key={domain.name} className="space-y-1.5 animate-in fade-in duration-300">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-foreground">{domain.name}</span>
                <span className={style.textClass}>{domain.percentage}%</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${style.barClass}`}
                  style={{ width: `${domain.percentage}%` }}
                />
              </div>
            </div>
          );
        })}

        <div className="pt-2 border-t border-border flex items-center justify-between text-xs font-bold text-primary hover:underline cursor-pointer group">
          <span>Ver detalle de afinidad</span>
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </CardContent>
    </Card>
  );
}
