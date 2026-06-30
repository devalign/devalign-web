'use client';

import AuthShell from '@/app/(auth)/login/_components/auth-shell';
import LandingContent from './landing-content';

export default function HomeClient() {
  return (
    <AuthShell>
      <LandingContent />
    </AuthShell>
  );
}
