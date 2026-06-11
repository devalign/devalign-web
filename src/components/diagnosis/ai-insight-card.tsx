import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  insight: string;
  isEmpty?: boolean;
}

export function AiInsightCard({ insight, isEmpty = false }: Props) {
  return (
    <Card className="border-border bg-card h-full flex flex-col justify-between shadow-sm">
      <div>
        <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xs font-bold text-muted-foreground flex items-center gap-2 tracking-wider uppercase">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            Insight IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEmpty ? (
            <div className="p-4 rounded-xl border border-dashed border-border/80 bg-secondary/5 flex items-center justify-center h-20 text-muted-foreground/50">
              <span className="text-[10px] uppercase font-bold tracking-wider">Esperando diagnóstico</span>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-50/10 dark:bg-emerald-950/5 relative overflow-hidden">
              <p className="text-xs text-foreground leading-relaxed">
                {insight}
              </p>
            </div>
          )}
        </CardContent>
      </div>
      <div className="px-6 pb-6 pt-2">
        <button 
          disabled={isEmpty}
          className={cn(
            "flex items-center justify-between text-xs font-bold w-full transition-colors",
            isEmpty 
              ? "text-muted-foreground/45 cursor-not-allowed select-none" 
              : "text-muted-foreground hover:text-foreground cursor-pointer"
          )}
        >
          Ver detalle del insight
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </Card>
  );
}
