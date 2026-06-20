'use client';

import React from 'react';
import { CVAnalysisProvider } from '@/contexts/cv-analysis-context';

export default function OverviewLayout({ children }: { children: React.ReactNode }) {
  return <CVAnalysisProvider>{children}</CVAnalysisProvider>;
}
