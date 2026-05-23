import React from 'react';
import ProfileAside from '@/components/profile/profile-aside';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full w-full flex-col lg:flex-row">
      {/* Contenido Principal (Columna 2) */}
      <div className="flex-1 p-6 sm:p-8 md:p-10">
        <div className="mx-auto max-w-4xl xl:max-w-5xl">
          {children}
        </div>
      </div>

      {/* Aside Contextual (Columna 3) */}
      <aside className="w-full border-t border-border bg-card/30 p-6 sm:p-8 lg:w-[350px] lg:min-w-[350px] lg:border-t-0 lg:border-l xl:w-[380px] xl:min-w-[380px]">
        <ProfileAside />
      </aside>
    </div>
  );
}
