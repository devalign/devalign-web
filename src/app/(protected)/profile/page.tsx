import React, { Suspense } from 'react';

import ProfileDashboardView from '@/components/profile/profile-dashboard-view';

function ProfileLoading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-xs text-muted-foreground font-semibold">Cargando perfil...</p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileLoading />}>
      <ProfileDashboardView />
    </Suspense>
  );
}
