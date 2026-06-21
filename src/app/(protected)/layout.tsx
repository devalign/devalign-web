'use client';

import React, { Suspense } from 'react';
import AppSidebar from '@/components/layout/app-sidebar';
import { SidebarProvider } from '@/components/layout/sidebar-context';
import { GlobalHeader } from '@/components/layout/global-header';
import { CVAnalysisProvider } from '@/contexts/cv-analysis-context';

function ProtectedLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background font-sans antialiased">
      <div suppressHydrationWarning className="flex h-full w-full gap-0 lg:gap-3">
        <AppSidebar />

        <main
          suppressHydrationWarning
          className="flex-1 overflow-y-auto overflow-x-hidden bg-background flex flex-col relative pb-3 lg:pb-6"
        >
          <div className="sticky top-0 z-30 w-full pointer-events-none pt-3 px-3 lg:pt-6 lg:px-6">
            <div className="pointer-events-auto pb-4">
              <GlobalHeader />
            </div>
          </div>
          <div className="flex-1 min-h-0 w-full relative">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <CVAnalysisProvider>
      <SidebarProvider>
        <Suspense fallback={null}>
          <ProtectedLayoutContent>{children}</ProtectedLayoutContent>
        </Suspense>
      </SidebarProvider>
    </CVAnalysisProvider>
  );
}
