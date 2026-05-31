export type Criticality = 'Crítica' | 'Alta' | 'Media' | 'Baja';
export type MatchLevel = 'Alta' | 'Media' | 'Baja';
export type SkillLevel = 'Básico' | 'Intermedio' | 'Avanzado' | 'Experto' | 'Intermedio - Avanzado';

export interface SkillStrength {
  name: string;
  level: SkillLevel;
  score: number; // 1 to 4 for rendering dots
  demandPercentage?: number; // percentage of market demand in cluster
}

export interface SkillGap {
  name: string;
  criticality: Criticality;
  demandPercentage?: number; // percentage of market demand in cluster
}

export interface DomainAffinity {
  domain: string;
  profileScore: number;
  marketDemand: number;
}

export interface ClusterDemandDataPoint {
  month: string;
  demand: number;
}

export interface CompatibleRole {
  title: string;
  match: MatchLevel;
}

export interface DiagnosisResult {
  detectedSpecialty: string;
  alignmentPercentage: number;
  secondaryAffinities: { name: string; percentage: number }[];
  strengths: SkillStrength[];
  totalStrengthsCount: number;
  gaps: SkillGap[];
  totalGapsCount: number;
  domainAffinities: DomainAffinity[];
  clusterDemandGrowth: number;
  clusterDemandData: ClusterDemandDataPoint[];
  estimatedSeniority: string;
  seniorityYearsBasis: number;
  compatibleRoles: CompatibleRole[];
  aiInsight: string;
  totalSkillsDetected: number;
  domainsCovered: number;
}
