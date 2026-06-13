'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, ArrowRight, Loader2 } from 'lucide-react';

interface CompatibleRoleItem {
  title: string;
  match: 'Alta' | 'Media' | 'Baja';
}

interface CompatibleRolesCardProps {
  roles?: CompatibleRoleItem[];
  onViewAll?: () => void;
  isLoading?: boolean;
}

export function CompatibleRolesCard({
  roles = [],
  onViewAll,
  isLoading = false,
}: CompatibleRolesCardProps) {
  return (
    <Card className="shadow-lg shadow-black/5 border-border bg-card flex flex-col justify-between h-full min-h-[220px] relative overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-xs z-10 flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 text-primary animate-spin" />
          <p className="text-[9px] font-bold font-mono text-muted-foreground animate-pulse">
            Buscando roles...
          </p>
        </div>
      )}

      {/* Header */}
      <div className="px-5 pt-5 pb-2 flex items-center gap-2">
        <Briefcase className="w-4 h-4 text-primary" />
        <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-muted-foreground">
          Roles Compatibles
        </span>
      </div>

      <CardContent className="flex-1 flex flex-col justify-between px-5 pb-5 pt-0 space-y-3">
        {/* Roles List */}
        <div className="space-y-2 mt-2">
          {roles.length === 0 && !isLoading && (
            <div className="flex items-center justify-center p-4 rounded-lg bg-secondary/35 border border-border/50 text-xs text-muted-foreground">
              No se detectaron roles compatibles.
            </div>
          )}
          {roles.map((role, idx) => {
            const badgeClass =
              role.match === 'Alta'
                ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                : role.match === 'Media'
                  ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                  : 'bg-red-500/10 text-red-600 border border-red-500/20';
            
            return (
              <div
                key={idx}
                className="flex justify-between items-center p-2.5 rounded-lg bg-secondary/35 border border-border/50 text-xs"
              >
                <span className="font-semibold text-foreground truncate max-w-[130px] sm:max-w-[150px]">{role.title}</span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold shrink-0 ${badgeClass}`}>
                  Afinidad {role.match}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer Link */}
        <div className="pt-2 text-right">
          <button
            onClick={onViewAll}
            className="text-[10px] font-bold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer bg-transparent border-0"
          >
            Ver más roles <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
