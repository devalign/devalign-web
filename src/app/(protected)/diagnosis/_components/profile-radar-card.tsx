'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { User, Loader2, Award } from 'lucide-react';
import { AffinityRadarChart } from './affinity-radar-chart';
import type { DomainAffinityItem } from '@/lib/api/types';
import { cn } from '@/lib/utils';

interface ProfileRadarCardProps {
  fullName: string;
  roleTitle: string;
  seniority: string;
  totalSkills: number;
  domainAffinities?: DomainAffinityItem[];
  isLoading?: boolean;
  className?: string;
}

export function ProfileRadarCard({
  fullName,
  roleTitle,
  seniority,
  totalSkills,
  domainAffinities,
  isLoading = false,
  className,
}: ProfileRadarCardProps) {
  return (
    <Card className={cn('relative overflow-hidden flex flex-col h-full card-standard', className)}>
      {isLoading && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-xs z-10 flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
        </div>
      )}

      {/* Profile Header Block */}
      <div className="p-5 border-b border-border/40 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary shrink-0">
            <User className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest block">
            Perfil Analizado
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground truncate mt-0.5 capitalize">
            {fullName}
          </p>
          <p className="text-xs text-muted-foreground truncate leading-normal">
            {roleTitle || 'Sin rol'}
          </p>

          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
              {seniority || 'Junior'}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-secondary text-muted-foreground border border-border/50 uppercase tracking-wider">
              <Award className="w-2.5 h-2.5" />
              {totalSkills} Skills Evaluadas
            </span>
          </div>
        </div>
      </div>

      {/* Radar Chart Component embedded */}
      <div className="flex-1 flex flex-col justify-between">
        <AffinityRadarChart
          domainAffinities={domainAffinities}
          isLoading={isLoading}
          standalone={false}
          className="flex-1"
        />
      </div>
    </Card>
  );
}
