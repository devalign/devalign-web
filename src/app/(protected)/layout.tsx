'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import AppSidebar from '@/components/layout/app-sidebar';
import { SidebarProvider, useSidebar } from '@/components/layout/sidebar-context';
import { useUserCVs } from '@/hooks/use-user-cvs';
import { Breadcrumb, BreadcrumbItem } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';

function ProtectedLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const { data: cvData } = useUserCVs();

  const getBreadcrumbs = (path: string): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [];

    if (path.startsWith('/profile')) {
      items.push({ label: 'Perfil Profesional', href: '/profile' });
    } else if (path.startsWith('/diagnosis')) {
      items.push({ label: 'Diagnóstico', href: '/diagnosis' });
    } else if (path.startsWith('/roadmap')) {
      items.push({ label: 'Roadmap', href: '/roadmap' });
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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-8 w-8 rounded-md text-muted-foreground hover:bg-muted cursor-pointer shrink-0"
              title={isCollapsed ? 'Expandir menú lateral' : 'Colapsar menú lateral'}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="h-4.5 w-4.5 text-foreground" />
              ) : (
                <PanelLeftClose className="h-4.5 w-4.5 text-foreground" />
              )}
            </Button>

            <div className="h-4 w-px bg-border shrink-0" />

            <Breadcrumb items={getBreadcrumbs(pathname)} />
          </div>

          {/* Right side: Page-specific metadata */}
          <div className="flex items-center gap-4 text-[10px] sm:text-xs text-muted-foreground font-medium select-none">
            {pathname.startsWith('/profile') && (
              <span className="flex items-center gap-1.5 bg-secondary/50 px-2.5 py-1 rounded-full border border-border/40">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Actualizado: {formattedDate}
              </span>
            )}
            {pathname.startsWith('/diagnosis') && (
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

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <ProtectedLayoutContent>{children}</ProtectedLayoutContent>
    </SidebarProvider>
  );
}
