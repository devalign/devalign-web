import React, { Suspense } from 'react';
import ProfileDashboardView from './_components/profile-dashboard-view';
import { LoadingScreen } from '@/components/shared/loading-screen';

export default function ProfilePage() {
  return (
    <Suspense fallback={<LoadingScreen message="Cargando perfil..." minHeight="min-h-[70vh]" />}>
      <ProfileDashboardView />
    </Suspense>
  );
}
