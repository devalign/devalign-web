'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  X, 
  Layers, 
  Info, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { GraphNode } from '../../profile/_components/graph/knowledge-graph-visualization';
import { ClusterAffinityItem, UserProfileData } from '@/lib/api/types';

interface NodeDetailCardProps {
  node: GraphNode;
  activeCluster: ClusterAffinityItem | null;
  profile: UserProfileData;
  onClose: () => void;
}

export function NodeDetailCard({ node, activeCluster, profile, onClose }: NodeDetailCardProps) {
  // Find skill in strengths/acquired or gaps
  const skillNameLower = node.label.toLowerCase();
  
  const acquiredSkill = (activeCluster?.detected_skills || []).find(
    (s) => s.name.toLowerCase() === skillNameLower
  );
  
  const gapSkill = (activeCluster?.skill_gaps || []).find(
    (g) => g.name.toLowerCase() === skillNameLower
  );

  // ICT calculations
  const ict = acquiredSkill?.ict_score ?? undefined;
  let level = 'Básico';
  let levelColor = 'text-muted-foreground bg-secondary border-border/40';
  if (ict !== undefined) {
    if (ict >= 7.0) {
      level = 'Avanzado';
      levelColor = 'text-success bg-success/10 border-success/20 dark:border-success/20';
    } else if (ict >= 4.0) {
      level = 'Intermedio';
      levelColor = 'text-warning bg-warning/10 border-warning/20 dark:border-warning/20';
    }
  }

  // Priority mapping
  const rawImportance = gapSkill?.market_importance ?? undefined;
  let priorityLabel = 'Baja prioridad';
  let priorityColor = 'text-muted-foreground bg-secondary border-border/40';
  if (rawImportance === 'critical') {
    priorityLabel = 'Alta prioridad';
    priorityColor = 'text-destructive bg-destructive/10 border-destructive/20 dark:border-destructive/20';
  } else if (rawImportance === 'high') {
    priorityLabel = 'Media prioridad';
    priorityColor = 'text-warning bg-warning/10 border-warning/20 dark:border-warning/20';
  }

  // Demand
  const demand = acquiredSkill?.market_demand_percentage ?? gapSkill?.market_demand_percentage ?? null;

  // Trend
  const trend = acquiredSkill?.trend ?? gapSkill?.trend ?? null;

  return (
    <Card className="card-glass! w-full min-h-[80vh] flex flex-col overflow-visible rounded-3xl border shadow-2xl relative">
      <CardHeader className="pb-3 border-b border-border/80 bg-muted/[0.03] flex flex-row items-center justify-between space-y-0 overflow-visible">
        <div className="min-w-0 pr-4">
          <CardTitle
            className="text-base font-bold text-foreground leading-tight truncate"
            title={node.label}
          >
            {node.label}
          </CardTitle>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {node.status === 'acquired' && (
              <Badge
                variant="outline"
                className="bg-success/10 text-success dark:text-success border-success/20 text-[9px] py-0 px-1.5 font-bold"
              >
                Adquirida
              </Badge>
            )}
            {node.status === 'gap' && (
              <Badge
                variant="outline"
                className="bg-warning/10 text-warning dark:text-warning border-warning/20 text-[9px] py-0 px-1.5 font-bold"
              >
                Brecha
              </Badge>
            )}
            {node.status === 'neutral' && (
              <Badge
                variant="outline"
                className="bg-info/10 text-info dark:text-info border-info/20 text-[9px] py-0 px-1.5 font-bold"
              >
                Relacionada
              </Badge>
            )}
            {node.status === 'market' && (
              <Badge
                variant="outline"
                className="bg-muted/30 text-muted-foreground border-border/30 text-[9px] py-0 px-1.5 font-bold"
              >
                Mercado
              </Badge>
            )}
            <Badge
              variant="secondary"
              className="bg-muted/30 text-muted-foreground border border-border/30 text-[9px] py-0 px-1.5 hover:bg-muted/30"
            >
              {node.group}
            </Badge>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full hover:bg-muted text-muted-foreground shrink-0 cursor-pointer"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="pt-5 space-y-6 flex-1 overflow-y-auto scrollbar-none overflow-visible">
        {/* Dynamic Metrics Section */}
        {(node.status === 'acquired' || node.status === 'gap') && (
          <div className="grid grid-cols-2 gap-3.5 overflow-visible">
            {/* Metric 1: Level / Priority */}
            {node.status === 'acquired' && ict !== undefined && (
              <div className="flex flex-col p-2.5 px-3 rounded-xl border border-border/40 bg-secondary/10 relative group">
                <div className="flex items-center justify-between text-[8px] font-extrabold text-muted-foreground uppercase tracking-wider">
                  <span>Dominio</span>
                  <Info className="w-3 h-3 cursor-help text-muted-foreground/60 hover:text-foreground" />
                </div>
                <div className="text-xs font-black mt-1">
                  <span className={cn('inline-flex px-1.5 py-0.5 rounded-full border text-[9px] font-bold leading-none', levelColor)}>
                    {level}
                  </span>
                </div>
                <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-1 w-48 rounded-md border border-border bg-card p-2 text-[8px] leading-normal text-muted-foreground opacity-0 shadow-lg transition-all group-hover:opacity-100 z-50 normal-case font-normal">
                  Nivel de dominio asignado según tu Índice de Credenciales Tecnológicas (ICT).
                </div>
              </div>
            )}

            {node.status === 'gap' && rawImportance !== undefined && (
              <div className="flex flex-col p-2.5 px-3 rounded-xl border border-border/40 bg-secondary/10 relative group">
                <div className="flex items-center justify-between text-[8px] font-extrabold text-muted-foreground uppercase tracking-wider">
                  <span>Prioridad</span>
                  <Info className="w-3 h-3 cursor-help text-muted-foreground/60 hover:text-foreground animate-pulse" />
                </div>
                <div className="text-xs font-black mt-1">
                  <span className={cn('inline-flex px-1.5 py-0.5 rounded-full border text-[9px] font-bold leading-none', priorityColor)}>
                    {priorityLabel}
                  </span>
                </div>
                <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-1 w-48 rounded-md border border-border bg-card p-2 text-[8px] leading-normal text-muted-foreground opacity-0 shadow-lg transition-all group-hover:opacity-100 z-50 normal-case font-normal">
                  La prioridad se define según la relevancia y demanda de esta habilidad para la especialidad.
                </div>
              </div>
            )}

            {/* Metric 2: ICT Score */}
            {node.status === 'acquired' && ict !== undefined && (
              <div className="flex flex-col p-2.5 px-3 rounded-xl border border-border/40 bg-secondary/10 relative group">
                <div className="flex items-center justify-between text-[8px] font-extrabold text-muted-foreground uppercase tracking-wider">
                  <span>Puntaje ICT</span>
                  <Info className="w-3 h-3 cursor-help text-muted-foreground/60 hover:text-foreground" />
                </div>
                <div className="flex items-baseline gap-1 mt-1 text-xs font-black text-foreground">
                  <span className="text-sm font-black text-primary">
                    {ict.toFixed(1)}
                  </span>
                  <span className="text-[8px] font-bold text-muted-foreground uppercase">/ 10</span>
                </div>
                <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-1 w-48 rounded-md border border-border bg-card p-2 text-[8px] leading-normal text-muted-foreground opacity-0 shadow-lg transition-all group-hover:opacity-100 z-50 normal-case font-normal">
                  El **ICT** es tu índice de credenciales, calculado combinando años de experiencia, certificaciones y proyectos.
                </div>
              </div>
            )}

            {/* Metric 3: Demand */}
            {demand !== null && (
              <div className="flex flex-col p-2.5 px-3 rounded-xl border border-border/40 bg-secondary/10 relative group">
                <div className="flex items-center justify-between text-[8px] font-extrabold text-muted-foreground uppercase tracking-wider">
                  <span>Demanda</span>
                  <Info className="w-3 h-3 cursor-help text-muted-foreground/60 hover:text-foreground" />
                </div>
                <div className="text-xs font-black mt-1 text-foreground">
                  {demand}% <span className="text-[8px] font-bold text-muted-foreground lowercase">de ofertas</span>
                </div>
                <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-1 w-48 rounded-md border border-border bg-card p-2 text-[8px] leading-normal text-muted-foreground opacity-0 shadow-lg transition-all group-hover:opacity-100 z-50 normal-case font-normal">
                  Porcentaje de ofertas del mercado peruano que solicitan explícitamente esta competencia.
                </div>
              </div>
            )}

            {/* Metric 4: Trend */}
            {trend !== null && (
              <div className="flex flex-col p-2.5 px-3 rounded-xl border border-border/40 bg-secondary/10 relative group">
                <div className="flex items-center justify-between text-[8px] font-extrabold text-muted-foreground uppercase tracking-wider">
                  <span>Tendencia</span>
                  <Info className="w-3 h-3 cursor-help text-muted-foreground/60 hover:text-foreground" />
                </div>
                <div className="flex items-center gap-1 mt-1 text-xs font-bold">
                  {trend === 'growing' && (
                    <>
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500 text-[9px] uppercase tracking-wider font-extrabold">Creciente</span>
                    </>
                  )}
                  {trend === 'shrinking' && (
                    <>
                      <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
                      <span className="text-rose-500 text-[9px] uppercase tracking-wider font-extrabold">Decreciente</span>
                    </>
                  )}
                  {trend === 'stable' && (
                    <>
                      <Activity className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground text-[9px] uppercase tracking-wider font-extrabold">Estable</span>
                    </>
                  )}
                </div>
                <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-1 w-48 rounded-md border border-border bg-card p-2 text-[8px] leading-normal text-muted-foreground opacity-0 shadow-lg transition-all group-hover:opacity-100 z-50 normal-case font-normal">
                  Comportamiento histórico de la demanda de esta habilidad en los últimos meses.
                </div>
              </div>
            )}
          </div>
        )}

        {/* Application Domains Section */}
        <div className="space-y-2">
          <h4 className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5" />
            Dominios de Aplicación
          </h4>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {node.domains.map((domain) => (
              <span
                key={domain}
                className="px-2 py-0.5 text-[10px] font-medium rounded-lg bg-muted/30 text-foreground border border-border/30"
              >
                {domain}
              </span>
            ))}
          </div>
        </div>

        {/* Contextual Analysis Section */}
        <div className="space-y-3 rounded-xl bg-info/5 border border-info/10 p-4 mt-6">
          <div className="flex items-center gap-2 text-info dark:text-info">
            <Info className="h-3.5 w-3.5" />
            <h4 className="text-[10px] font-bold uppercase tracking-wider">
              Análisis Contextual
            </h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {node.status === 'gap' ? (
              <>
                Esta tecnología se conecta con otras herramientas en tu grafo basadas en la demanda actual del mercado.
                Al ser una <strong>brecha en tu perfil</strong> para la especialidad de{' '}
                <strong>{activeCluster?.cluster_name || profile.primary_specialty}</strong>, adquirir esta habilidad
                fortalecería significativamente tu posición para los roles que la demandan.
              </>
            ) : node.status === 'acquired' ? (
              <>
                Ya posees esta competencia en tu perfil técnico. Con un nivel{' '}
                <strong>{level.toLowerCase()}</strong> en esta habilidad, te posicionas favorablemente
                dentro de este dominio.
              </>
            ) : node.status === 'neutral' ? (
              <>
                Es una tecnología conectada frecuentemente con tu ecosistema actual de herramientas y metodologías.
              </>
            ) : (
              <>
                Representa una habilidad general del mercado tecnológico no requerida de forma directa por tu especialidad actual.
              </>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
