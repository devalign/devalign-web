'use client';

import React from 'react';


export default function DiagnosisLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}
