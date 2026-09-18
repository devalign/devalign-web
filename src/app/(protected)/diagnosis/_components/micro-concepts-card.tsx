'use client';

import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Layers, Loader2 } from 'lucide-react';
import { getSkillMicroConcepts } from '@/lib/skill-concepts';
import { cn } from '@/lib/utils';

export interface ConceptSkillItem {
  name: string;
  domain_tags?: string[];
  core_domains?: string[];
}

interface MicroConceptsCardProps {
  detectedSkills?: ConceptSkillItem[];
  skillGaps?: ConceptSkillItem[];
  isLoading?: boolean;
  className?: string;
}

export function MicroConceptsCard({
  detectedSkills = [],
  skillGaps = [],
  isLoading = false,
  className,
}: MicroConceptsCardProps) {
  const microConcepts = useMemo(() => {
    const allSkills = [...detectedSkills, ...skillGaps];
    if (allSkills.length === 0) return [];

    const set = new Set<string>();
    allSkills.forEach((s) => {
      const concepts = getSkillMicroConcepts(s.name, s.domain_tags, s.core_domains);
      concepts.forEach((c) => {
        if (c && c.trim()) {
          set.add(c.trim());
        }
      });
    });

    return Array.from(set).sort((a, b) => a.localeCompare(b, 'es'));
  }, [detectedSkills, skillGaps]);

  return (
    <Card className={cn(className)}>
      <CardContent className="space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="text-[10px] font-extrabold text-foreground uppercase tracking-wider">
              Micro-Conceptos Clave
            </span>
          </div>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider font-mono">
            {microConcepts.length}
          </span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-4 gap-2">
            <Loader2 className="w-4 h-4 text-primary animate-spin" />
            <span className="text-[10px] font-mono text-muted-foreground animate-pulse">
              Extrayendo micro-conceptos...
            </span>
          </div>
        ) : microConcepts.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
            {microConcepts.map((concept) => (
              <span
                key={concept}
                className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-secondary/70 text-foreground border border-border/50 hover:border-primary/40 hover:bg-secondary transition-colors"
              >
                {concept}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-muted-foreground">No se detectaron conceptos adicionales.</p>
        )}
      </CardContent>
    </Card>
  );
}
