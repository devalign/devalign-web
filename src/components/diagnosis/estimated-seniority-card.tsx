import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award } from 'lucide-react';

interface Props {
  seniority: string;
  yearsBasis: number;
  isEmpty?: boolean;
}

export function EstimatedSeniorityCard({ seniority, yearsBasis, isEmpty = false }: Props) {
  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-bold text-muted-foreground flex items-center gap-2 tracking-wider uppercase">
          <Award className="h-4 w-4 text-primary" />
          Seniority Estimado
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {isEmpty ? (
          <div className="space-y-2.5 animate-pulse">
            <div className="flex items-center gap-2">
              <div className="h-6 bg-muted rounded-md w-24" />
              <div className="h-4.5 bg-muted rounded-md w-16" />
            </div>
            <div className="h-2.5 bg-muted rounded-md w-3/4" />
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="text-2xl font-bold text-foreground">{seniority}</div>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-primary/10 text-primary-foreground dark:text-primary rounded-md">
                Basado en {yearsBasis} años
              </span>
            </div>
            
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Perfil inferido por IA a partir de tu CV y experiencia detectada.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
