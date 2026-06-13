'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Network, Loader2 } from 'lucide-react';
import { ClusterAffinityItem } from '@/lib/api/types';

interface AllAffinitiesCardProps {
  affinities?: ClusterAffinityItem[];
  isLoading?: boolean;
}

export function AllAffinitiesCard({ affinities = [], isLoading = false }: AllAffinitiesCardProps) {
  // Sort affinities by score descending
  const sortedAffinities = [...affinities].sort((a, b) => b.affinity_score - a.affinity_score);

  return (
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
          <div className="space-y-3 pt-2">
            {sortedAffinities.map((affinity) => {
              const scorePercent = Math.round(affinity.affinity_score * 100);
              const isPrimary = affinity.is_primary;
              
              return (
                <div key={affinity.cluster_id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className={`font-semibold ${isPrimary ? 'text-primary' : 'text-foreground'}`}>
                      {affinity.cluster_name} {isPrimary && <span className="text-[9px] px-1.5 py-0.5 ml-1 rounded-full bg-primary/10 text-primary">Primaria</span>}
                    </span>
                    <span className="font-bold text-muted-foreground">{scorePercent}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-secondary overflow-hidden rounded-full">
                    <div 
                      className={`h-full ${isPrimary ? 'bg-primary' : 'bg-muted-foreground/40'} rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${scorePercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
