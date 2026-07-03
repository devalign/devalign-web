import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadCV } from '@/lib/api';

/**
 * Mutation hook for CV upload.
 * The `onSuccess` callback now receives the full API response so callers
 * can extract `data.cv_id` and start polling for analysis completion.
 */
export function useUploadCV() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadCV(file),
    onSuccess: async (data) => {
      // Invalidate after upload — the full profile query refresh happens
      // once the analysis completes and the user commits.
      queryClient.invalidateQueries({ queryKey: ['userCVs'] });
      // Return data so consumers can read cv_id from the mutation result.
      return data;
    },
  });
}
