'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Settings2, Loader2 } from 'lucide-react';

interface ProfileSkillsCardProps {
  fullName: string;
  roleTitle: string;
  seniority: string;
  isLoading?: boolean;
}

export function ProfileSkillsCard({
  fullName,
  roleTitle,
  seniority,
  isLoading = false,
}: ProfileSkillsCardProps) {

  return (
    <Card className="shadow-lg shadow-black/5 border-border bg-card overflow-hidden relative h-full flex flex-col justify-between">
      <div className="h-2 bg-gradient-to-r from-primary/30 via-primary to-primary/60" />
      
      {isLoading && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-xs z-10 flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <p className="text-[10px] font-bold font-mono text-muted-foreground animate-pulse">
            Procesando perfil...
          </p>
        </div>
      )}

      <CardContent className="pt-5 flex-1 flex flex-col justify-between">
        {/* Cabecera Perfil */}
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary/10 text-primary rounded-lg shrink-0">
                <User className="w-4 h-4" />
              </div>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-bold font-mono bg-secondary text-foreground uppercase">
                {seniority}
              </span>
            </div>
            <h2 className="text-lg font-bold tracking-tight text-foreground truncate mt-1">
              {fullName}
            </h2>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">
              {roleTitle}
            </p>
          </div>
          
          <div className="shrink-0">
            <Link href="/profile">
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:bg-primary/10 text-xs h-8 cursor-pointer gap-1"
              >
                <Settings2 className="w-3.5 h-3.5" />
                Ajustar
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
