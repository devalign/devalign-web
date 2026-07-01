import type { ClusterAffinityItem, DomainAffinityItem } from './diagnosis';

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
  self_taught?: boolean;
  personal_projects?: boolean;
  years_of_experience?: number;
  has_certification?: boolean;
  ict_score?: number;
  trend?: 'growing' | 'stable' | 'shrinking' | null;
}

export interface UserProfileData {
  user_id: string;
  cv_id: string | null;
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
  last_analysis_date?: string | null;
}
