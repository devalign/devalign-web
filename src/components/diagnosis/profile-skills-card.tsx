'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { User, Settings2, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileSkillsCardProps {
  fullName: string;
  roleTitle: string;
  seniority: string;
  techSkills: string[];
  softSkills: string[];
  toolsSkills: string[];
  activeTab: 'tech' | 'soft' | 'tools';
  setActiveTab: (tab: 'tech' | 'soft' | 'tools') => void;
  isLoading?: boolean;
}

export function ProfileSkillsCard({
  fullName,
  roleTitle,
  seniority,
  techSkills,
  softSkills,
  toolsSkills,
  activeTab,
  setActiveTab,
  isLoading = false,
}: ProfileSkillsCardProps) {

  return (
    <Card className="shadow-lg shadow-black/5 border-border bg-card overflow-hidden relative">
      <div className="h-2 bg-gradient-to-r from-primary/30 via-primary to-primary/60" />
      
      {isLoading && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-xs z-10 flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <p className="text-[10px] font-bold font-mono text-muted-foreground animate-pulse">
            Procesando perfil...
          </p>
        </div>
      )}

      <CardContent className="pt-5 space-y-6">
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
          <Link href="/profile" className="shrink-0">
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

        <Separator className="bg-border/60" />

        {/* Habilidades Detectadas */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-extrabold text-foreground uppercase tracking-wider">
              Habilidades Detectadas
            </span>
          </div>

          {/* Tabs */}
          <div className="grid grid-cols-3 gap-1 bg-secondary/35 p-0.5 rounded-lg border border-border/50">
            {(['tech', 'soft', 'tools'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer',
                  activeTab === tab
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {tab === 'tech' ? 'Técnicas' : tab === 'soft' ? 'Blandas' : 'Herramientas'}
              </button>
            ))}
          </div>

          {/* Chips Grid */}
          <div className="flex flex-wrap gap-1.5 min-h-[100px] align-content-start">
            {(activeTab === 'tech'
              ? techSkills
              : activeTab === 'soft'
                ? softSkills
                : toolsSkills
            ).map((skill) => (
              <div
                key={skill}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-foreground border border-border/70"
              >
                <span>{skill}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
