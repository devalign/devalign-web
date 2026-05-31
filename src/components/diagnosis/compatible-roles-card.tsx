import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, ArrowRight } from 'lucide-react';
import { CompatibleRole } from './types';
import { cn } from '@/lib/utils';

interface Props {
  roles: CompatibleRole[];
  isEmpty?: boolean;
}

export function CompatibleRolesCard({ roles, isEmpty = false }: Props) {
  return (
    <Card className="border-border bg-card h-full flex flex-col justify-between shadow-sm">
      <div>
        <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xs font-bold text-muted-foreground flex items-center gap-2 tracking-wider uppercase">
            <Briefcase className="h-4 w-4 text-primary" />
            Roles Compatibles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col gap-3">
            {isEmpty ? null : (
              roles.map((role) => (
                <div 
                  key={role.title} 
                  className="p-3 rounded-xl border border-border bg-card flex items-center justify-between gap-2 transition-all hover:bg-muted/5"
                >
                  <span className="font-semibold text-xs text-foreground truncate">{role.title}</span>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                    role.match === 'Alta' 
                      ? 'text-primary-foreground dark:text-primary bg-primary/5 border-primary/20' 
                      : 'text-muted-foreground bg-secondary/50 border-border'
                  }`}>
                    Afinidad {role.match}
                  </span>
                </div>
              ))
            )}
          </div>
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
          Ver más roles
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </Card>
  );
}
