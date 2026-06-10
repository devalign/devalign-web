import { apiClient } from './api-client';
import { UserProfile, CVUploadResult, CVList, UserProfileData, SkillItem } from './types';

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

/**
 * Gets the detailed computed user profile and analysis.
 */
export async function getUserProfile(): Promise<UserProfileData> {
  return apiClient<UserProfileData>('/profile/me');
}

/**
 * Manually updates personal and experience details on the profile.
 */
export async function updateUserProfile(data: Partial<UserProfileData>): Promise<UserProfileData> {
  return apiClient<UserProfileData>('/profile/me', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

/**
 * Updates skills manually for the developer profile.
 */
export async function updateUserProfileSkills(skills: SkillItem[]): Promise<UserProfileData> {
  return apiClient<UserProfileData>('/profile/skills', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ skills }),
  });
}
