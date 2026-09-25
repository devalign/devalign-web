'use client';

import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Sparkles, ArrowRight, Check } from 'lucide-react';
import type { ClusterAffinityItem } from '@/types/diagnosis';

export interface SpecialtySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSpecialty: (clusterName: string) => void;
  currentSpecialty?: string | null;
  affinities: ClusterAffinityItem[];
}

function cleanSkillName(name: string): string {
  const acronymMatch = name.match(/\(([A-Z0-9/]{2,6})\)/);
  if (acronymMatch && name.length > 15) {
    return acronymMatch[1];
  }
  return (
    name
      .replace(
        /\s*\((?:programming language|software engineering|web framework|design software|database management system)\)/gi,
        '',
      )
      .trim() || name
  );
}

export function SpecialtySelectorModal({
  isOpen,
  onClose,
  onSelectSpecialty,
  currentSpecialty,
  affinities,
}: SpecialtySelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const sortedAndFilteredAffinities = useMemo(() => {
    let list = [...affinities];

    // Sort by affinity_score descending
    list.sort((a, b) => {
      const scoreA = a.affinity_score ?? 0;
      const scoreB = b.affinity_score ?? 0;
      return scoreB - scoreA;
    });

    if (normalizedQuery) {
      list = list.filter((item) => {
        const nameMatch = item.cluster_name.toLowerCase().includes(normalizedQuery);
        const skillMatch = item.top_skills?.some((s) =>
          s.toLowerCase().includes(normalizedQuery),
        );
        return nameMatch || skillMatch;
      });
    }

    return list;
  }, [affinities, normalizedQuery]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-6 gap-4">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <DialogTitle className="text-base sm:text-lg font-black tracking-tight text-foreground">
              Explorar y Cambiar Especialidad
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Selecciona una especialidad del mercado IT para ver tu nivel de alineación y análisis de brechas.
          </DialogDescription>
        </DialogHeader>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar especialidad o tecnología (ej. Python, React, Cloud)..."
            className="w-full h-10 pl-9 pr-4 text-xs rounded-xl bg-secondary/50 border border-border/80 focus:border-primary focus:bg-background focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground cursor-pointer font-bold"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 max-h-[50vh]">
          {sortedAndFilteredAffinities.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center border border-dashed border-border rounded-xl">
              <Search className="w-8 h-8 text-muted-foreground opacity-30 mb-2" />
              <p className="text-xs font-bold text-foreground">No se encontraron especialidades</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Intenta buscar con otro término o tecnología.
              </p>
            </div>
          ) : (
            sortedAndFilteredAffinities.map((item) => {
              const isActive =
                currentSpecialty?.toLowerCase() === item.cluster_name.toLowerCase();
              const rawScore = item.affinity_score;
              const matchPercent =
                rawScore !== undefined && rawScore !== null
                  ? rawScore > 1
                    ? Math.round(rawScore)
                    : Math.round(rawScore * 100)
                  : null;

              return (
                <div
                  key={item.cluster_name}
                  onClick={() => {
                    onSelectSpecialty(item.cluster_name);
                    onClose();
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isActive
                      ? 'border-primary bg-primary/5 shadow-xs'
                      : 'border-border/80 bg-card hover:border-primary/40 hover:bg-secondary/20'
                  }`}
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4
                        className={`text-xs sm:text-sm font-extrabold truncate ${
                          isActive ? 'text-primary' : 'text-foreground'
                        }`}
                      >
                        {item.cluster_name}
                      </h4>
                      {matchPercent !== null ? (
                        <Badge
                          className={`text-[10px] py-0 px-2 font-bold rounded-md shrink-0 ${
                            isActive
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-primary/15 text-primary border-primary/30'
                          }`}
                        >
                          {matchPercent}% Match
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-muted/15 text-muted-foreground text-[10px] py-0 px-2 font-semibold rounded-md shrink-0"
                        >
                          Disponible
                        </Badge>
                      )}
                    </div>

                    {item.top_skills && item.top_skills.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {item.top_skills.slice(0, 4).map((skill) => (
                          <span
                            key={skill}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground border border-border/40 font-medium truncate max-w-[140px]"
                          >
                            {cleanSkillName(skill)}
                          </span>
                        ))}
                        {item.top_skills.length > 4 && (
                          <span className="text-[10px] text-muted-foreground font-semibold">
                            +{item.top_skills.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="shrink-0 flex items-center justify-end gap-2">
                    {isActive ? (
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-bold gap-1 py-1 px-2.5">
                        <Check className="w-3.5 h-3.5" />
                        <span>Actual</span>
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectSpecialty(item.cluster_name);
                          onClose();
                        }}
                        className="h-8 text-xs font-bold gap-1 px-3 border-border/80 hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all cursor-pointer"
                      >
                        <span>Ver diagnóstico</span>
                        <ArrowRight className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
