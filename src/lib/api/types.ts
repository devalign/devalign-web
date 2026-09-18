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
  status?: 'processing' | 'skills_detected' | 'completed' | 'failed';
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
  self_taught?: boolean;
  personal_projects?: boolean;
  years_of_experience?: number;
  has_certification?: boolean;
  ict_score?: number;
  trend?: 'growing' | 'stable' | 'shrinking' | null;
  domain_tags?: string[];
  core_domains?: string[];
}

export interface CompatibleRoleItem {
  title: string;
  match: 'Alta' | 'Media' | 'Baja';
  frequency?: number;
}

export interface ExperienceDistribution {
  junior_percentage: number;
  mid_percentage: number;
  senior_percentage: number;
  unspecified_percentage: number;
}

export interface MarketInsights {
  average_salary_usd?: number | null;
  average_salary_pen?: number | null;
  salary_p25_usd?: number | null;
  salary_median_usd?: number | null;
  salary_p75_usd?: number | null;
  salary_differential_percentage?: number | null;
  market_share_percentage?: number | null;
  total_demand?: number | null;
  negotiable_rate?: number | null;
  growth_percentage?: number | null;
  experience_distribution?: ExperienceDistribution;
}

export interface SalaryProjection {
  current_estimated_salary_usd: number;
  current_estimated_salary_pen: number;
  projected_salary_usd: number;
  projected_salary_pen: number;
  potential_gain_percentage: number;
  cluster_average_usd: number;
  cluster_p75_usd: number;
  salary_p25_usd?: number;
  salary_p25_pen?: number;
  salary_median_usd?: number;
  salary_median_pen?: number;
  salary_p75_pen?: number;
}

export interface OpportunityProjection {
  direct_matches_count: number;
  potential_matches_count: number;
  total_cluster_offers: number;
  unlock_percentage: number;
}

export interface GapImpactItem {
  skill_name: string;
  skill_type: string;
  market_importance: string;
  salary_boost_usd: number;
  salary_boost_pen: number;
  opportunity_boost_count: number;
  market_demand_percentage: number;
}

export interface ClusterAffinityItem {
  cluster_id: string;
  cluster_name: string;
  affinity_score: number;
  is_primary: boolean;
  market_insights?: MarketInsights;
  compatible_roles?: CompatibleRoleItem[];
  detected_skills?: SkillItem[];
  skill_gaps?: SkillItem[];
  job_offer_count?: number;
  top_skills?: string[];
}

export interface DomainAffinityItem {
  domain: string;
  affinity_score: number;
  market_demand?: number;
}

export interface UserProfileData {
  user_id: string;
  cv_id: string | null;
  seniority: string;
  primary_specialty: string | null;
  alignment_score: number;
  secondary_affinities: ClusterAffinityItem[];
  all_affinities?: ClusterAffinityItem[];
  domain_affinities?: DomainAffinityItem[];
  detected_skills: SkillItem[];
  skill_gaps: SkillItem[];
  full_name: string | null;
  current_job_role: string | null;
  professional_summary?: string | null;
  years_experience: number | null;
  preferred_modality: string | null;
  location: string | null;
  availability: string | null;
  work_experience: WorkExperienceItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  last_analysis_date?: string | null;
  is_diagnosed?: boolean;
}

export interface FinalizeResponse {
  cv_id: string;
  status: string;
  message: string;
}

export interface Cluster {
  id: string;
  name: string;
  description: string;
  top_skills: string[];
  job_offer_count: number;
}

export interface SkillSearchResult {
  id: string;
  name: string;
  skill_type: string;
  domain_tags?: string[];
  core_domains?: string[];
}
