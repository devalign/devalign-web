'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

interface CompatibleRoleItem {
  title: string;
  match: 'Alta' | 'Media' | 'Baja';
}

interface CompatibleRolesCardProps {
  roles?: CompatibleRoleItem[];
  isLoading?: boolean;
}

export function CompatibleRolesCard({
  roles = [
    { title: 'Backend Java Developer', match: 'Alta' },
    { title: 'Java Cloud Engineer', match: 'Alta' },
    { title: 'Data Engineer Junior', match: 'Media' },
  ],
  isLoading = false,
}: CompatibleRolesCardProps) {
  const [rolesExpanded, setRolesExpanded] = useState(false);

  return (
    <Card className="shadow-lg shadow-black/5 border-border bg-card relative overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-xs z-10 flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 text-primary animate-spin" />
          <p className="text-[9px] font-bold font-mono text-muted-foreground animate-pulse">
            Buscando roles...
          </p>
        </div>
      )}

      <button
        onClick={() => !isLoading && setRolesExpanded(!rolesExpanded)}
        className="w-full text-left px-6 py-4 flex items-center justify-between cursor-pointer"
        disabled={isLoading}
      >
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span className="text-xs font-extrabold text-foreground uppercase tracking-wider">
            Roles compatibles en el mercado
          </span>
        </div>
        {rolesExpanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      
      {rolesExpanded && !isLoading && (
        <CardContent className="pt-0 pb-4 border-t border-border/50">
          <div className="space-y-2 pt-4">
            {roles.map((role, idx) => {
              const badgeClass =
                role.match === 'Alta'
                  ? 'bg-emerald-500/10 text-emerald-600'
                  : role.match === 'Media'
                    ? 'bg-amber-500/10 text-amber-600'
                    : 'bg-red-500/10 text-red-600';
              return (
                <div
                  key={idx}
                  className="flex justify-between items-center p-2 rounded-lg bg-secondary/35 text-xs"
                >
                  <span className="font-bold text-foreground">{role.title}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${badgeClass}`}>
                    Afinidad {role.match}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
