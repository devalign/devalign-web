'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface SidebarContextType {
  isCollapsed: boolean;
  isMobile: boolean;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 1024px)');

    const handleMobileChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
    };

    handleMobileChange(mobileQuery);

    mobileQuery.addEventListener('change', handleMobileChange);

    return () => mobileQuery.removeEventListener('change', handleMobileChange);
  }, []);

  return (
    <SidebarContext.Provider value={{ isCollapsed: true, isMobile }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}
