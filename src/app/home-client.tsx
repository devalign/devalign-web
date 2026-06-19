'use client';

import AuthShell from '@/components/auth/auth-shell';
import LandingContent from '@/components/landing/landing-content';

export default function HomeClient() {
  return (
    <AuthShell>
      <LandingContent />
    </AuthShell>
  );
}
