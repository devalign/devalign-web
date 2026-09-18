'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Loader2, Award, Settings2, ChevronRight } from 'lucide-react';
import { AffinityRadar } from './affinity-radar';
import { DomainAffinityDetailModal } from '../../profile/_components/domain-affinity-detail-modal';
import type { DomainAffinityItem } from '@/lib/api/types';
import { cn } from '@/lib/utils';

interface ProfileRadarCardProps {
  fullName: string;
  roleTitle: string;
  seniority: string;
  totalSkills: number;
  totalConcepts?: number;
  detectedSkills?: Array<{ name: string; domain_tags?: string[]; core_domains?: string[] }>;
  skillGaps?: Array<{ name: string; domain_tags?: string[]; core_domains?: string[] }>;
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const seniorityNormalized = (seniority || '').toLowerCase();
  const isJunior = seniorityNormalized.includes('junior') || seniorityNormalized.includes('jr');
  const isSenior =
    seniorityNormalized.includes('senior') ||
    seniorityNormalized.includes('sr') ||
    seniorityNormalized.includes('lead');
  const isMid = !isJunior && !isSenior;

  const seniorityLevels = [
    { key: 'junior', label: 'Jr (0-2 años)', active: isJunior },
    { key: 'mid', label: 'Mid (3-5 años)', active: isMid },
    { key: 'senior', label: 'Senior (6+ años)', active: isSenior },
  ];

  return (
    <>
      <Card className={cn('relative overflow-visible flex flex-col h-full card-standard justify-between', className)}>
        {isLoading && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-xs z-10 flex flex-col items-center justify-center gap-2">
            <Loader2 className="h-6 w-6 text-primary animate-spin" />
          </div>
        )}

        {/* Profile Header Block */}
        <div className="px-4 border-b border-border/40 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10 text-primary shrink-0">
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest block">
                Perfil Analizado
              </span>
            </div>

            <Link href="/profile">
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:bg-primary/10 text-[10px] h-7 cursor-pointer gap-1 px-2 hover:text-primary shrink-0"
              >
                <Settings2 className="w-3 h-3" />
                Ajustar
              </Button>
            </Link>
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground truncate capitalize">
              {fullName}
            </p>
            <p className="text-xs text-muted-foreground truncate leading-normal pt-1">
              {roleTitle || 'Sin rol'}
            </p>

            {/* 3-tier Seniority Badges with active highlight and full opacity */}
            <div className="flex flex-wrap items-center gap-1.5 mt-4">
              {seniorityLevels.map((lvl) => (
                <span
                  key={lvl.key}
                  className={cn(
                    'inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider transition-colors',
                    lvl.active
                      ? 'bg-info/20 text-info border border-info/40 font-extrabold shadow-2xs'
                      : 'bg-secondary/70 text-muted-foreground border border-border/50'
                  )}
                >
                  {lvl.label}
                </span>
              ))}
            </div>

            {/* Skills Evaluadas Badge */}
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold bg-primary/15 text-primary border border-primary/30 uppercase tracking-wider">
                <Award className="w-2.5 h-2.5 text-primary" />
                {totalSkills} Skills Evaluadas
              </span>
            </div>
          </div>
        </div>

        {/* Radar Chart Section */}
        <div className="flex-1 flex flex-col justify-center px-4 py-2 overflow-visible">
          <AffinityRadar
            domainAffinities={domainAffinities}
            isLoading={isLoading}
            className="flex-1"
          />
        </div>

        {/* Card Footer: Ver detalle de afinidad */}
        <div className="border-t border-border/40 px-3 py-1">
          <Button
            variant="ghost"
            onClick={() => setIsModalOpen(true)}
            className="w-full justify-between h-7 text-[11px] text-primary hover:text-primary font-bold px-2 hover:bg-primary/10 cursor-pointer"
          >
            <span>Ver detalle de afinidad</span>
            <ChevronRight className="h-4 w-4 text-primary" />
          </Button>
        </div>
      </Card>

      <DomainAffinityDetailModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        domainAffinities={domainAffinities}
      />
    </>
  );
}

