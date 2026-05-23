'use client';

import React from 'react';
import AppSidebar from '@/components/layout/app-sidebar';
import { SidebarProvider } from '@/components/layout/sidebar-context';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background font-sans antialiased">
        {/* Sidebar (Columna 1) */}
        <AppSidebar />

        {/* Contenedor Principal (Para Columnas 2 y 3) */}
        <main className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden bg-background">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
