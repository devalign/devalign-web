import { apiClient } from './api-client';
import { CVUploadResult, CVList, CVStatus, UserProfileData, SkillItem, Cluster } from '@/types';
import { FinalizeResponse } from './types';

/**
 * Uploads a CV document (PDF or DOCX, max 5MB).
 */
export async function uploadCV(file: File): Promise<CVUploadResult> {
  const formData = new FormData();
  formData.append('file', file);

  return apiClient<CVUploadResult>('/me/cv', {
    method: 'POST',
    body: formData,
  });
}

/**
 * Lists all CVs uploaded by the user.
 */
export async function listUserCVs(): Promise<CVList> {
  return apiClient<CVList>('/me/cvs');
}

/**
 * Gets the processing status for a specific CV.
 */
export async function getCVStatus(cvId: string): Promise<CVStatus> {
  return apiClient<CVStatus>(`/me/cvs/${cvId}/status`);
}

/**
 * Triggers re-analysis of a CV that was previously uploaded.
 */
export async function reanalyzeCV(cvId: string): Promise<CVUploadResult> {
  return apiClient<CVUploadResult>(`/me/cvs/${cvId}/reanalyze`, {
    method: 'POST',
  });
}

/**
 * Deletes a CV document from history.
 */
export async function deleteCV(cvId: string): Promise<void> {
  return apiClient<void>(`/me/cvs/${cvId}`, {
    method: 'DELETE',
  });
}

/**
 * Gets the detailed computed user profile and analysis.
 */
export async function getUserProfile(): Promise<UserProfileData> {
  return apiClient<UserProfileData>('/me');
}

/**
 * Manually updates personal and experience details on the profile.
 */
export async function updateUserProfile(data: Partial<UserProfileData>): Promise<UserProfileData> {
  return apiClient<UserProfileData>('/me', {
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
  return apiClient<UserProfileData>('/me/skills', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ skills }),
  });
}

/**
 * Finalizes CV analysis (Phase 2) with validated skills.
 * Called after the user has reviewed their detected skills.
 */
export async function finalizeCVAnalysis(
  cvId: string,
  skills?: SkillItem[],
): Promise<FinalizeResponse> {
  return apiClient<FinalizeResponse>(`/me/cv/${cvId}/finalize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(skills ? { skills } : {}),
  });
}

/**
 * Gets all market clusters from the API.
 */
export async function getMarketClusters(): Promise<Cluster[]> {
  return apiClient<Cluster[]>('/market/clusters');
}

/**
 * Evaluates the user's profile against a specific tech cluster to generate a diagnostic.
 */
export async function evaluateClusterDiagnostic(clusterName: string): Promise<UserProfileData> {
  return apiClient<UserProfileData>(`/me/affinities/${encodeURIComponent(clusterName)}`, {
    method: 'POST',
  });
}

/**
 * Resets the user's account (deletes profile, CVs, diagnostics).
 */
export async function resetAccount(): Promise<void> {
  return apiClient<void>('/me/reset', {
    method: 'POST',
  });
}

/**
 * Permanently deletes the user's account and all associated data.
 */
export async function deleteAccount(): Promise<void> {
  return apiClient<void>('/me', {
    method: 'DELETE',
  });
}

