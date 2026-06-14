'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Network, Loader2, Cpu, Database, Binary, Info } from 'lucide-react';
import { ClusterAffinityItem } from '@/lib/api/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

interface AllAffinitiesCardProps {
  affinities?: ClusterAffinityItem[];
  isLoading?: boolean;
  activeClusterName?: string;
  onSelectAffinity?: (name: string) => void;
}

const MARKET_CLUSTERS = [
  {
    name: 'Data Engineering',
    offers: 148,
    percent: 24.6,
    description: 'Procesamiento de datos a gran escala, ETLs y almacenamiento relacional/no-relacional.',
    skills: ['SQL', 'Python', 'Spark', 'Hadoop', 'AWS', 'PostgreSQL']
  },
  {
    name: 'Backend Development',
    offers: 138,
    percent: 23.0,
    description: 'Construcción de APIs, lógica de negocio del lado del servidor y arquitectura de microservicios.',
    skills: ['Java', 'Spring Boot', 'Node.js', 'SQL', 'PostgreSQL', 'Docker', 'Git']
  },
  {
    name: 'Cloud & DevOps Engineer',
    offers: 125,
    percent: 20.8,
    description: 'Automatización de despliegues, infraestructura como código y administración de nube.',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Linux', 'Git', 'CI/CD']
  },
  {
    name: 'Frontend Development',
    offers: 105,
    percent: 17.5,
    description: 'Interfaces de usuario interactivas, rendimiento web y diseño adaptativo.',
    skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML', 'Git', 'Tailwind']
  },
  {
    name: 'QA & Automation',
    offers: 84,
    percent: 14.0,
    description: 'Aseguramiento de la calidad de software, pruebas automatizadas y pipelines de integración.',
    skills: ['QA', 'SQL', 'Selenium', 'Cypress', 'Git', 'Python', 'Postman']
  }
];

export function AllAffinitiesCard({ 
  affinities = [], 
  isLoading = false,
  activeClusterName,
  onSelectAffinity
}: AllAffinitiesCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Sort affinities by score descending
  const sortedAffinities = [...affinities].sort((a, b) => b.affinity_score - a.affinity_score);

  return (
    <>
      <Card className="shadow-lg shadow-black/5 border-border bg-card flex flex-col h-full min-h-[220px] relative overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-xs z-10 flex flex-col items-center justify-center gap-2">
            <Loader2 className="h-6 w-6 text-primary animate-spin" />
            <p className="text-[9px] font-bold font-mono text-muted-foreground animate-pulse">
              Recalculando afinidades...
            </p>
          </div>
        )}

        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-primary" />
            <CardTitle className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">
              Todas las Especialidades (Clusters)
            </CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          {sortedAffinities.length === 0 && !isLoading ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
              <span className="text-xs">No hay afinidades detectadas</span>
            </div>
          ) : (
            <div className="space-y-2.5 pt-2">
              {sortedAffinities.map((affinity) => {
                const scorePercent = Math.round(affinity.affinity_score * 100);
                const isPrimary = affinity.is_primary;
                const isActive = affinity.cluster_name === activeClusterName;
                
                return (
                  <div 
                    key={affinity.cluster_id} 
                    onClick={() => onSelectAffinity?.(affinity.cluster_name)}
                    className={`space-y-1 p-2 rounded-lg transition-all cursor-pointer border ${
                      isActive 
                        ? 'bg-primary/5 border-primary/20 shadow-xs scale-[1.01]' 
                        : 'hover:bg-secondary/40 border-transparent'
                    }`}
                  >
                    <div className="flex justify-between text-xs">
                      <span className={`font-semibold transition-colors ${isActive ? 'text-primary' : isPrimary ? 'text-primary/80' : 'text-foreground'}`}>
                        {affinity.cluster_name} {isPrimary && <span className="text-[9px] px-1.5 py-0.5 ml-1 rounded-full bg-primary/10 text-primary">Primaria</span>}
                      </span>
                      <span className="font-bold text-muted-foreground">{scorePercent}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-secondary overflow-hidden rounded-full">
                      <div 
                        className={`h-full ${isActive ? 'bg-primary' : isPrimary ? 'bg-primary/70' : 'bg-muted-foreground/40'} rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${scorePercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>

        <div className="p-3 pt-0 border-t border-border/40 mt-auto flex justify-end">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsOpen(true)}
            className="text-[10px] h-8 font-bold text-primary hover:bg-primary/5 cursor-pointer gap-1"
          >
            <Network className="w-3.5 h-3.5" />
            Ver topología del mercado
          </Button>
        </div>
      </Card>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="sm:max-w-md md:max-w-lg bg-card border-l border-border flex flex-col h-full">
          <SheetHeader className="pb-4">
            <SheetTitle className="flex items-center gap-2 text-primary font-bold">
              <Network className="w-5 h-5 text-primary" />
              <span>Topología del Mercado IT</span>
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground mt-1">
              Estructura técnica descubierta mediante análisis no supervisado de la demanda laboral actual.
            </SheetDescription>
          </SheetHeader>

          {/* ML Metadata Panel */}
          <div className="p-3.5 rounded-xl bg-secondary/35 border border-border/50 space-y-2 text-[11px] mb-4">
            <h4 className="font-bold text-foreground flex items-center gap-1.5 mb-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
              <Cpu className="h-3.5 w-3.5 text-primary" />
              Ficha Técnica del Modelo
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 font-medium">
              <div className="flex flex-col gap-0.5">
                <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Volumen analizado</span>
                <span className="text-foreground font-semibold flex items-center gap-1">
                  <Database className="h-3 w-3 text-muted-foreground" />
                  600 ofertas reales
                </span>
              </div>
              <div className="flex flex-col gap-0.5 border-l border-border/60 pl-3">
                <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Habilidades únicas</span>
                <span className="text-foreground font-semibold flex items-center gap-1">
                  <Binary className="h-3 w-3 text-muted-foreground" />
                  73 tecnologías
                </span>
              </div>
              <div className="flex flex-col gap-0.5 mt-1">
                <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Algoritmo</span>
                <span className="text-foreground font-semibold flex items-center gap-1">
                  <Cpu className="h-3 w-3 text-muted-foreground" />
                  K-Modes Multivariado
                </span>
              </div>
              <div className="flex flex-col gap-0.5 mt-1 border-l border-border/60 pl-3">
                <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Frecuencia</span>
                <span className="text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
                  <Info className="h-3 w-3 text-blue-500" />
                  Semanal (Automatizada)
                </span>
              </div>
            </div>
          </div>

          {/* Cluster List */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
            {MARKET_CLUSTERS.map((cluster) => (
              <div 
                key={cluster.name} 
                className="p-3.5 rounded-xl border border-border/50 hover:border-primary/25 bg-secondary/10 hover:bg-secondary/20 transition-all duration-200 space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-sm text-foreground">
                    {cluster.name}
                  </h3>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Badge variant="outline" className="text-[9px] font-bold py-0.5 px-2 bg-background border-border/80 text-muted-foreground">
                      {cluster.offers} ofertas
                    </Badge>
                    <Badge className="text-[9px] font-extrabold py-0.5 px-2 bg-primary/10 text-primary border-0">
                      {cluster.percent}%
                    </Badge>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {cluster.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1.5">
                  {cluster.skills.map((skill) => (
                    <span 
                      key={skill} 
                      className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-secondary text-foreground/80 hover:text-foreground transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
