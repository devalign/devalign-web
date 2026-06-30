import type { SkillItem } from './profile';
import type { MarketInsights } from './market';

export interface CompatibleRoleItem {
  title: string;
  match: 'Alta' | 'Media' | 'Baja';
  frequency?: number;
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
}

export interface DomainAffinityItem {
  domain: string;
  affinity_score: number;
  market_demand?: number;
}
