'use client';

import React, { Suspense } from 'react';
import AppSidebar from '@/components/layout/app-sidebar';
import { SidebarProvider, useSidebar } from '@/components/layout/sidebar-context';

function ProtectedLayoutContent({ children }: { children: React.ReactNode }) {
  const { isMobile } = useSidebar();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background font-sans antialiased">
      <div suppressHydrationWarning className={`flex h-full w-full ${isMobile ? '' : 'gap-2 lg:gap-3'}`}>
        <AppSidebar />

        <main
          suppressHydrationWarning
          className={`
            flex-1 overflow-y-auto overflow-x-hidden bg-background
            ${isMobile ? 'py-3' : 'py-4 sm:py-6'}
          `}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Suspense fallback={null}>
        <ProtectedLayoutContent>{children}</ProtectedLayoutContent>
      </Suspense>
    </SidebarProvider>
  );
}
