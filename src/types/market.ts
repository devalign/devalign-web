export interface MarketInsights {
  average_salary_pen?: number | null;
  salary_differential_percentage?: number | null;
  market_share_percentage?: number | null;
  total_demand?: number | null;
  growth_percentage?: number | null;
}

export interface Cluster {
  id: string;
  name: string;
  description: string;
  top_skills: string[];
  job_offer_count: number;
}
