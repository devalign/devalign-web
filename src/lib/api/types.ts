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
}

export interface CVList {
  user_id: string;
  cvs: CVUploadResult[];
  total: number;
}

export interface WorkExperienceItem {
  company: string;
  role: string;
  description: string;
  start_date: string;
  end_date: string | null;
  current: boolean;
}

export interface EducationItem {
  institution: string;
  degree: string;
  start_date: string;
  end_date: string | null;
}

export interface CertificationItem {
  name: string;
  issuer: string | null;
  date: string | null;
}

export interface SkillItem {
  name: string;
  skill_type: string;
  market_importance?: string | null;
  market_demand_percentage?: number | null;
}

export interface CompatibleRoleItem {
  title: string;
  match: 'Alta' | 'Media' | 'Baja';
  frequency?: number;
}

export interface MarketInsights {
  average_salary_pen?: number | null;
  salary_differential_percentage?: number | null;
  market_share_percentage?: number | null;
  total_demand?: number | null;
  growth_percentage?: number | null;
}

export interface ClusterAffinityItem {
  cluster_id: string;
  cluster_name: string;
  affinity_score: number;
  is_primary: boolean;
  market_insights?: MarketInsights;
  compatible_roles?: CompatibleRoleItem[];
}

export interface DomainAffinityItem {
  domain: string;
  affinity_score: number;
}

export interface UserProfileData {
  user_id: string;
  cv_id: string;
  seniority: string;
  primary_specialty: string;
  alignment_score: number;
  secondary_affinities: ClusterAffinityItem[];
  all_affinities?: ClusterAffinityItem[];
  domain_affinities?: DomainAffinityItem[];
  detected_skills: SkillItem[];
  skill_gaps: SkillItem[];
  full_name: string | null;
  current_job_role: string | null;
  years_experience: number | null;
  preferred_modality: string | null;
  location: string | null;
  availability: string | null;
  work_experience: WorkExperienceItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
}
