'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import { SkillItem } from '@/lib/api/types';

interface InsightCardProps {
  primarySpecialty: string;
  skillGaps: SkillItem[];
}

export default function InsightCard({ primarySpecialty, skillGaps }: InsightCardProps) {
  // Generate a friendly message based on user profile and gaps
  const topGaps = skillGaps.slice(0, 2).map((s) => s.name);
  const gapMessage =
    topGaps.length > 0
      ? `Fortalecer habilidades clave como ${topGaps.join(' y ')} podría aumentar tu alineación con el mercado en +28%.`
      : '¡Excelente alineación técnica! Tu perfil cumple con todas las demandas del clúster.';

  return (
    <Card className="border-border bg-emerald-50/20 dark:bg-emerald-950/5 relative overflow-hidden">
      <CardContent className="p-5 flex gap-3.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary-foreground">
          <Lightbulb className="h-5 w-5 text-primary fill-primary/10" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Insight IA
          </h4>
          <p className="text-xs text-foreground leading-relaxed">
            Tu perfil tiene alta afinidad con roles{' '}
            <strong className="font-semibold">{primarySpecialty}</strong> en entornos modernos.{' '}
            {gapMessage}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
