import { apiClient } from './api-client';
import { UserProfile, CVUploadResult, CVList } from './types';

/**
 * Gets the currently logged-in user profile, provisioning JIT if needed.
 */
export async function getCurrentUser(): Promise<UserProfile> {
  return apiClient<UserProfile>('/users/me');
}

/**
 * Uploads a CV document (PDF or DOCX, max 5MB).
 */
export async function uploadCV(file: File): Promise<CVUploadResult> {
  const formData = new FormData();
  formData.append('file', file);

  return apiClient<CVUploadResult>('/users/me/cv', {
    method: 'POST',
    body: formData,
  });
}

/**
 * Lists all CVs uploaded by the user.
 */
export async function listUserCVs(): Promise<CVList> {
  return apiClient<CVList>('/users/me/cvs');
}
