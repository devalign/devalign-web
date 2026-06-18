'use client';

import CVUploader from '@/components/profile/cv-uploader';

interface LandingContentProps {
  onOpenAuth: () => void;
}

export default function LandingContent({ onOpenAuth }: LandingContentProps) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <CVUploader onUploadSuccess={() => onOpenAuth()} />
    </div>
  );
}
