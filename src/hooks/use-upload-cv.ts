import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadCV } from '@/lib/api';

export function useUploadCV() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadCV(file),
    onSuccess: () => {
      // Invalidate both caches so the page detects the cv_id mismatch
      // and transitions to the "Analyzing" loading state
      queryClient.invalidateQueries({ queryKey: ['userCVs'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
}
