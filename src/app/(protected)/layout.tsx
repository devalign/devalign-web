'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import AppSidebar from '@/components/layout/app-sidebar';
import { SidebarProvider } from '@/components/layout/sidebar-context';
import { useUserCVs } from '@/hooks/use-user-cvs';
import { Breadcrumb, BreadcrumbItem } from '@/components/ui/breadcrumb';
import { CVAnalysisProvider, useCVAnalysis } from '@/contexts/cv-analysis-context';
import { Loader2, Network } from 'lucide-react';
import { Button } from '@/components/ui/button';

function ProtectedLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: cvData } = useUserCVs();
  const { isAnalyzing, isAnalysisReady } = useCVAnalysis();

  const getBreadcrumbs = (path: string): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [];
    const cluster = searchParams.get('cluster');

    if (path.startsWith('/profile')) {
      items.push({ label: 'Perfil Profesional', href: '/profile' });
    } else if (path.startsWith('/dashboard/action-plan')) {
      items.push({ label: 'Evaluación', href: '/dashboard' });
      if (cluster) {
        items.push({ label: cluster, href: `/dashboard?cluster=${encodeURIComponent(cluster)}` });
      }
      items.push({ label: 'Plan de Acción', href: `/dashboard/action-plan?cluster=${encodeURIComponent(cluster || '')}` });
    } else if (path.startsWith('/market')) {
      items.push({ label: 'Mercado', href: `/market?cluster=${encodeURIComponent(cluster || '')}` });
      if (cluster) {
        items.push({ label: cluster, href: `/market?cluster=${encodeURIComponent(cluster)}` });
      }
    } else if (path.startsWith('/dashboard')) {
      items.push({ label: 'Evaluación', href: '/dashboard' });
      if (cluster) {
        items.push({ label: cluster, href: `/dashboard?cluster=${encodeURIComponent(cluster)}` });
      }
    }

    return items;
  };

  const currentCV = cvData?.cvs?.[0];
  const formattedDate = currentCV?.uploaded_at
    ? new Date(currentCV.uploaded_at).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Recientemente';

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background font-sans antialiased">
      {/* Sidebar (Columna 1) */}
      <AppSidebar />

      {/* Contenedor Principal (Para Columnas 2 y 3) */}
      <main className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden bg-background">
        {/* Header Global con Breadcrumb */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4 sm:px-6 bg-card/40 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <Breadcrumb items={getBreadcrumbs(pathname)} />
          </div>

          {/* Right side: Page-specific metadata & status */}
          <div className="flex items-center gap-3 text-[10px] sm:text-xs text-muted-foreground font-medium select-none">
            {!pathname.startsWith('/market') && (
              <Link href={`/market?cluster=${encodeURIComponent(searchParams.get('cluster') || '')}`} className="mr-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs font-bold flex items-center gap-1.5 bg-background border-border hover:bg-muted cursor-pointer"
                >
                  <Network className="h-3.5 w-3.5 text-primary" />
                  Ver Mercado
                </Button>
              </Link>
            )}
            {isAnalyzing && (
              <span className="flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-1 rounded-full border border-primary/20 font-semibold animate-pulse">
                <Loader2 className="h-3 w-3 animate-spin text-primary" />
                <span>Analizando CV...</span>
              </span>
            )}
            {isAnalysisReady && (
              <span className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20 font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span>Actualización Lista</span>
              </span>
            )}
            {pathname.startsWith('/profile') && (
              <span className="flex items-center gap-1.5 bg-secondary/50 px-2.5 py-1 rounded-full border border-border/40">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Actualizado: {formattedDate}
              </span>
            )}

            {(pathname.startsWith('/dashboard') || pathname.startsWith('/market')) && (
              <span className="flex items-center gap-1.5 bg-secondary/50 px-2.5 py-1 rounded-full border border-border/40">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                Último análisis: {formattedDate}
              </span>
            )}
          </div>
        </header>

        {/* Contenido de la página */}
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}

import { Suspense } from 'react';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <CVAnalysisProvider>
        <Suspense fallback={null}>
          <ProtectedLayoutContent>{children}</ProtectedLayoutContent>
        </Suspense>
      </CVAnalysisProvider>
    </SidebarProvider>
  );
}
