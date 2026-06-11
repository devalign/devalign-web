'use client';

import React from 'react';
import { SidebarProvider } from '@/components/layout/sidebar-context';
import AppSidebar from '@/components/layout/app-sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-background">
        {/* Sidebar */}
        <AppSidebar />

        {/* Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <main className="flex-1 overflow-y-auto min-h-0 relative">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
