'use client';

import React from 'react';
import { FileSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter, usePathname } from 'next/navigation';

interface EmptyProfileBannerProps {
  show?: boolean;
}

export function EmptyProfileBanner({ show = true }: EmptyProfileBannerProps) {
  const router = useRouter();
  const pathname = usePathname();

  if (!show) return null;

  return (
    <div className="my-2 lg:my-6 p-4 rounded-xl border border-orange-500/20 bg-orange-500/5 dark:bg-orange-500/15 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-300">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-orange-500/10 p-2 text-orange-600 dark:text-orange-400">
          <FileSearch className="h-5 w-5 animate-pulse" />
        </div>
        <div className="space-y-0.5 text-center sm:text-left">
          <p className="text-sm font-bold text-foreground">¡Hola! Carguemos tu perfil para comenzar</p>
          <p className="text-xs text-muted-foreground">
            Por favor, sube tu CV para acceder a tu diagnóstico y panorama completo de habilidades.
          </p>
        </div>
      </div>
      {pathname !== '/profile' && (
        <Button
          onClick={() => router.push('/profile')}
          className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md active:scale-[0.98] shrink-0"
        >
          Cargar Perfil
        </Button>
      )}
    </div>
  );
}
