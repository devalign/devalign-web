'use client';

import * as React from 'react';
import { Database, Binary, Cpu, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { InsightCard } from '@/components/shared';

export interface MarketSidebarProps {
  totalOffers: number;
  className?: string;
}

/**
 * Sticky sidebar displaying the technical model sheet and aggregate market insights.
 */
export function MarketSidebar({ totalOffers, className }: MarketSidebarProps) {
  return (
    <aside className={cn('space-y-6 lg:sticky lg:top-6 self-start', className)}>
      {/* Technical Model Sheet */}
      <div className="space-y-4">
        <Card className="card-standard overflow-hidden border-border/80">
          <CardContent className="space-y-4 px-4 sm:px-6 pt-5 pb-6">
            <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">
              Ficha Técnica del Modelo
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Este análisis agrupa ofertas laborales de TI en base a la co-ocurrencia de
              habilidades técnicas utilizando técnicas avanzadas de minería de datos.
            </p>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/5 text-primary border border-primary/10 shrink-0">
                  <Database className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase font-extrabold tracking-wider text-muted-foreground">
                    Volumen Analizado
                  </h4>
                  <p className="text-xs font-bold text-foreground mt-0.5">
                    {totalOffers} ofertas reales activas
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-normal mt-0.5">
                    Extraídas directamente de portales y canales de empleo de tecnología.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/5 text-primary border border-primary/10 shrink-0">
                  <Binary className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase font-extrabold tracking-wider text-muted-foreground">
                    Habilidades Únicas
                  </h4>
                  <p className="text-xs font-bold text-foreground mt-0.5">
                    73 tecnologías distintas
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-normal mt-0.5">
                    Mapeadas y limpiadas a partir de los requisitos listados en las ofertas.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/5 text-primary border border-primary/10 shrink-0">
                  <Cpu className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase font-extrabold tracking-wider text-muted-foreground">
                    Algoritmo Utilizado
                  </h4>
                  <p className="text-xs font-bold text-foreground mt-0.5">
                    Clustering HDBSCAN sobre UMAP
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-normal mt-0.5">
                    Clustering jerárquico basado en densidad optimizado con reducción
                    dimensional para capturar afinidades complejas de habilidades.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-500/5 text-blue-500 border border-blue-500/10 shrink-0">
                  <Info className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase font-extrabold tracking-wider text-muted-foreground">
                    Frecuencia de Actualización
                  </h4>
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                    Semanal (Automatizada)
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-normal mt-0.5">
                    El sistema sincroniza nuevos datos los domingos para mantener el pulso del
                    mercado.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Market Insights Context Panel */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">
            Insights de Mercado
          </span>
          <div className="h-px flex-1 bg-border/40" />
        </div>

        <InsightCard
          title="Brecha del Perfil Predominante"
          description={
            <>
              El <strong className="text-foreground">45%</strong> del mercado demanda{' '}
              <strong>Desarrolladores Web Full Stack</strong>. Su mayor deficiencia generalizada
              es el <strong className="text-foreground">Testing Automatizado</strong>.
            </>
          }
          type="trend"
          value="Tendencia"
        />

        <InsightCard
          title="Brechas Más Frecuentes"
          description={
            <>
              De las últimas evaluaciones, el <strong className="text-foreground">62%</strong>{' '}
              de los desarrolladores presentan debilidades críticas en{' '}
              <strong>DevOps (Docker/CI/CD)</strong> independientemente de su rol.
            </>
          }
          type="gap"
          value="Top Brecha"
        />
      </div>
    </aside>
  );
}
