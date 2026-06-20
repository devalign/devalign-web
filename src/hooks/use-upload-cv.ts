import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadCV } from '@/lib/api';

export function useUploadCV() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadCV(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userCVs'] });
    },
  });
}
