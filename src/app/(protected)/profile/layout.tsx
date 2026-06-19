'use client';

import React from 'react';
import { CVAnalysisProvider } from '@/contexts/cv-analysis-context';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <CVAnalysisProvider>{children}</CVAnalysisProvider>;
}
