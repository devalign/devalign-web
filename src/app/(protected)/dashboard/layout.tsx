'use client';

import React from 'react';
import { CVAnalysisProvider } from '@/contexts/cv-analysis-context';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <CVAnalysisProvider>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 md:px-6">{children}</div>
        </div>
      </div>
    </CVAnalysisProvider>
  );
}
