'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserProfileCardProps {
  fullName: string;
  roleTitle: string;
  seniority: string;
  className?: string;
}

export function UserProfileCard({
  fullName,
  roleTitle,
  seniority,
  className,
}: UserProfileCardProps) {
  return (
    <Card className={cn('card-glass relative overflow-hidden flex flex-col shrink-0', className)}>
      <div className="h-2 bg-linear-to-r from-primary/30 via-primary to-primary/60 shrink-0" />
      <div className="p-5 flex justify-between items-start gap-4">
        <div className="space-y-1 flex-1 min-w-0">
          <h2 className="text-xl font-black tracking-tight text-foreground truncate">{fullName}</h2>
          <div className="flex items-center gap-2">
            <p className="text-[11px] text-muted-foreground font-bold leading-relaxed">
              {roleTitle}
            </p>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-bold font-mono bg-primary/10 text-primary uppercase">
              {seniority}
            </span>
          </div>
        </div>

        <div className="shrink-0">
          <Link href="/profile">
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:bg-primary/10 text-[10px] h-7 cursor-pointer gap-1 px-2"
            >
              <Settings2 className="w-3 h-3" />
              Ajustar
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
