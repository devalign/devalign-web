'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Check, AlertCircle, Layers, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSkillMacroDomain } from '@/lib/skill-concepts';

export interface ConceptSkillItem {
  name: string;
  domain_tags?: string[];
  core_domains?: string[];
  market_importance?: string;
  ict_score?: number;
}

interface ConceptCoverageCardProps {
  detectedSkills?: ConceptSkillItem[];
  skillGaps?: ConceptSkillItem[];
  isLoading?: boolean;
  className?: string;
}

interface ConceptGroup {
  name: string;
  acquired: ConceptSkillItem[];
  gaps: ConceptSkillItem[];
  total: number;
  coveragePct: number;
}

export function ConceptCoverageCard({
  detectedSkills = [],
  skillGaps = [],
  isLoading = false,
  className,
}: ConceptCoverageCardProps) {
  if (isLoading) {
    return (
      <Card className={cn('p-5', className)}>
        <div className="flex items-center justify-center py-12 gap-2">
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
          <span className="text-xs font-mono text-muted-foreground animate-pulse">
            Calculando cobertura conceptual...
          </span>
        </div>
      </Card>
    );
  }

  // 1. Group skills by macro-concept domain
  const conceptMap = new Map<string, { acquired: ConceptSkillItem[]; gaps: ConceptSkillItem[] }>();

  const registerSkill = (skill: ConceptSkillItem, isAcquired: boolean) => {
    const primaryConcept = getSkillMacroDomain(skill.name, skill.domain_tags, skill.core_domains);

    if (!conceptMap.has(primaryConcept)) {
      conceptMap.set(primaryConcept, { acquired: [], gaps: [] });
    }

    const entry = conceptMap.get(primaryConcept)!;
    if (isAcquired) {
      if (!entry.acquired.some((s) => s.name === skill.name)) {
        entry.acquired.push(skill);
      }
    } else {
      if (!entry.gaps.some((s) => s.name === skill.name)) {
        entry.gaps.push(skill);
      }
    }
  };

  detectedSkills.forEach((s) => registerSkill(s, true));
  skillGaps.forEach((g) => registerSkill(g, false));

  // 2. Build structured groups
  const groups: ConceptGroup[] = Array.from(conceptMap.entries()).map(
    ([name, { acquired, gaps }]) => {
      const total = acquired.length + gaps.length;
      const coveragePct = total > 0 ? Math.round((acquired.length / total) * 100) : 0;
      return {
        name,
        acquired,
        gaps,
        total,
        coveragePct,
      };
    }
  );

  // 3. Sort groups: lowest coverage first, then alphabetically
  groups.sort((a, b) => {
    if (a.coveragePct !== b.coveragePct) {
      return a.coveragePct - b.coveragePct;
    }
    return a.name.localeCompare(b.name);
  });

  if (groups.length === 0) {
    return null;
  }

  const fullyCoveredCount = groups.filter((g) => g.coveragePct === 100).length;

  return (
    <Card className={cn('relative overflow-hidden p-5 card-standard flex flex-col gap-4', className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/40">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest block">
              Cobertura Conceptual del Clúster
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-normal">
            Desglose de suficiencia técnica agrupada por conceptos clave requeridos en esta especialidad.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-secondary text-foreground border border-border">
            {fullyCoveredCount} de {groups.length} conceptos dominados
          </span>
        </div>
      </div>

      {/* Responsive Multi-Column Concept Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-1">
        {groups.map((group) => {
          const isFull = group.coveragePct === 100;
          const isPartial = group.coveragePct > 0 && group.coveragePct < 100;

          return (
            <div
              key={group.name}
              className="p-3.5 rounded-xl border border-border/50 bg-secondary/10 hover:bg-secondary/20 transition-all flex flex-col justify-between gap-3"
            >
              <div className="space-y-2">
                {/* Header per Concept */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-foreground truncate">
                    {group.name}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {group.acquired.length}/{group.total}
                    </span>
                    <span
                      className={cn(
                        'text-[10px] font-black tracking-tight',
                        isFull
                          ? 'text-success'
                          : isPartial
                            ? 'text-warning'
                            : 'text-destructive'
                      )}
                    >
                      {group.coveragePct}%
                    </span>
                  </div>
                </div>

                {/* Progress Meter */}
                <div className="w-full h-1.5 rounded-full bg-secondary/80 overflow-hidden border border-border/40">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      isFull
                        ? 'bg-success'
                        : isPartial
                          ? 'bg-warning'
                          : 'bg-destructive/80'
                    )}
                    style={{ width: `${Math.max(6, group.coveragePct)}%` }}
                  />
                </div>
              </div>

              {/* Skills Chips Breakdown */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {group.acquired.map((s) => (
                  <span
                    key={s.name}
                    className="inline-flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-md bg-success/10 text-success border border-success/20"
                  >
                    <Check className="w-2.5 h-2.5 text-success stroke-[3]" />
                    {s.name}
                  </span>
                ))}

                {group.gaps.map((g) => (
                  <span
                    key={g.name}
                    className={cn(
                      'inline-flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-md border border-dashed',
                      g.market_importance === 'critical'
                        ? 'bg-destructive/10 text-destructive border-destructive/30'
                        : 'bg-warning/10 text-warning border-warning/30'
                    )}
                  >
                    <AlertCircle className="w-2.5 h-2.5 shrink-0" />
                    {g.name}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// Retain alias export for backwards compatibility
export { ConceptCoverageCard as ConceptCoverageBars };

