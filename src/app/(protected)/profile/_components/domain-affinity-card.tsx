'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Target,
  Info,
  ChevronRight,
  Code2,
  Cloud,
  Infinity,
  Monitor,
  Database,
  Smartphone,
  ShieldCheck,
} from 'lucide-react';
import type { DomainAffinityItem } from '@/types/diagnosis';
import { DomainAffinityDetailModal } from './domain-affinity-detail-modal';

interface DomainAffinityCardProps {
  domainAffinities?: DomainAffinityItem[];
  isDiagnosed?: boolean;
  isUpdating?: boolean;
}

const DOMAIN_ICONS: Record<string, React.ComponentType<any>> = {
  Backend: Code2,
  Cloud: Cloud,
  DevOps: Infinity,
  Frontend: Monitor,
  Data: Database,
  Mobile: Smartphone,
  QA: ShieldCheck,
};

const DOMAIN_LABELS: Record<string, string> = {
  Backend: 'Backend',
  Cloud: 'Cloud',
  DevOps: 'DevOps',
  Frontend: 'Frontend',
  Data: 'Data Engineering',
  Mobile: 'Mobile',
  QA: 'QA',
};

export function DomainAffinityCard({ domainAffinities, isDiagnosed, isUpdating }: DomainAffinityCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Process and sort domain affinities
  const processedAffinities = (domainAffinities || [])
    .map((d) => {
      const key = d.domain;
      const rawScore = d.affinity_score || 0;
      const score = Math.min(20 + Math.round(rawScore * 80), 95);
      return {
        key,
        label: DOMAIN_LABELS[key] || key,
        score,
        icon: DOMAIN_ICONS[key] || Target,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5); // Show top 5 in the card

  return (
    <>
      <Card className="card-standard overflow-visible">
        <CardContent className="space-y-4">
          {/* Card Header */}
          <div className="flex flex-col items-start gap-1 pb-2 border-b border-border/10">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-info" />
              <h3 className="text-sm font-black text-foreground">Afinidad con dominios</h3>
              <div className="group relative">
                <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground cursor-help transition-colors" />
                <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-52 rounded-md border border-border bg-card p-2 text-[10px] leading-relaxed text-muted-foreground opacity-0 shadow-lg transition-all group-hover:opacity-100 z-50">
                  Muestra tu nivel de afinidad con los principales dominios tecnológicos del
                  desarrollo de software.
                </div>
              </div>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Tus afinidades con los principales dominios tecnológicos.
              </p>
            </div>
          </div>

          {/* Dominios List */}
          <div className="space-y-3">
            {processedAffinities.length === 0 && isUpdating && !isDiagnosed ? (
              <div className="space-y-3 animate-pulse">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-muted shrink-0" />
                    <div className="h-4 w-28 bg-muted rounded shrink-0" />
                    <div className="flex-1 h-1 rounded-full bg-muted" />
                    <div className="h-4 w-8 bg-muted rounded shrink-0" />
                  </div>
                ))}
              </div>
            ) : processedAffinities.length === 0 ? (
              <div className="w-full rounded-xl border border-dashed border-border p-6 text-center">
                <p className="text-xs font-semibold text-muted-foreground">
                  Aún no hay dominios detectados.
                </p>
              </div>
            ) : (
              processedAffinities.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.key} className="flex items-center gap-3">
                    {/* Icon container */}
                    <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Icon className="h-4.5 w-4.5" />
                    </div>

                    {/* Domain label */}
                    <span className="text-xs font-bold text-foreground w-28 shrink-0 truncate">
                      {item.label}
                    </span>

                    {/* Progress bar */}
                    <div className="flex-1 h-1 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-600 dark:bg-emerald-500 transition-all duration-500"
                        style={{ width: `${item.score}%` }}
                      />
                    </div>

                    {/* Score percentage */}
                    <span className="text-xs font-black text-foreground w-8 text-right shrink-0 tabular-nums">
                      {item.score}%
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Card footer / Link */}
          {processedAffinities.length > 0 && (
            <div className="border-t border-border/15 pt-3">
              <Button
                variant="ghost"
                onClick={() => setIsModalOpen(true)}
                className="w-full justify-between h-8 text-[11px] text-primary hover:text-primary font-bold px-1 hover:bg-transparent"
              >
                Ver detalle de afinidad
                <ChevronRight className="h-4 w-4 text-primary" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <DomainAffinityDetailModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        domainAffinities={domainAffinities}
      />
    </>
  );
}
