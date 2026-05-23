export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
}

export interface CVUploadResult {
  cv_id: string;
  user_id: string;
  storage_path: string;
  original_filename: string;
  size_bytes: number;
  download_url: string | null;
  message: string;
}

export interface CVList {
  user_id: string;
  cvs: CVUploadResult[];
  total: number;
}
