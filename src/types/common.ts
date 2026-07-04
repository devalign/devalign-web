export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at?: string;
}

export interface CVUploadResult {
  cv_id: string;
  user_id: string;
  storage_path: string;
  original_filename: string;
  size_bytes: number;
  download_url: string | null;
  message: string;
  uploaded_at?: string;
  status?: 'processing' | 'completed' | 'failed';
  error_message?: string | null;
}

export interface CVList {
  user_id: string;
  cvs: CVUploadResult[];
  total: number;
}

import type { SkillItem } from './profile';

export interface CVStatus {
  cv_id: string | null;
  status: string | null;
  uploaded_at?: string | null;
  error_message?: string | null;
  extracted_skills?: SkillItem[] | null;
}
