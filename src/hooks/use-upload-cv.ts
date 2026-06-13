import { useMutation } from '@tanstack/react-query';
import { uploadCV } from '@/lib/api';

export function useUploadCV() {
  return useMutation({
    mutationFn: (file: File) => uploadCV(file),
    onSuccess: () => {
      // Do nothing here; CVAnalysisContext will handle polling and explicit invalidation
    },
  });
}
