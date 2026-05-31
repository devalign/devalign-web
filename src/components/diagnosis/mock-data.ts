import { DiagnosisResult } from './types';

export const mockDiagnosisData: DiagnosisResult = {
  detectedSpecialty: 'Backend Java Cloud-Native',
  alignmentPercentage: 64,
  secondaryAffinities: [
    { name: 'DevOps', percentage: 63 },
    { name: 'Data Engineering', percentage: 41 },
  ],
  strengths: [
    { name: 'Java', level: 'Intermedio - Avanzado', score: 3, demandPercentage: 92 },
    { name: 'Spring Boot', level: 'Intermedio', score: 2, demandPercentage: 85 },
    { name: 'REST APIs', level: 'Intermedio', score: 2, demandPercentage: 78 },
    { name: 'PostgreSQL', level: 'Intermedio', score: 2, demandPercentage: 65 },
    { name: 'Git', level: 'Intermedio', score: 2, demandPercentage: 88 },
  ],
  totalStrengthsCount: 24,
  gaps: [
    { name: 'Docker', criticality: 'Crítica', demandPercentage: 74 },
    { name: 'Kubernetes', criticality: 'Crítica', demandPercentage: 68 },
    { name: 'AWS', criticality: 'Alta', demandPercentage: 58 },
    { name: 'Microservicios', criticality: 'Alta', demandPercentage: 82 },
    { name: 'CI/CD', criticality: 'Alta', demandPercentage: 70 },
  ],
  totalGapsCount: 9,
  domainAffinities: [
    { domain: 'Backend', profileScore: 85, marketDemand: 90 },
    { domain: 'Frontend', profileScore: 30, marketDemand: 60 },
    { domain: 'Cloud', profileScore: 50, marketDemand: 80 },
    { domain: 'DevOps', profileScore: 40, marketDemand: 70 },
    { domain: 'Data', profileScore: 45, marketDemand: 50 },
  ],
  clusterDemandGrowth: 28,
  clusterDemandData: [
    { month: 'Ene', demand: 100 },
    { month: 'Feb', demand: 105 },
    { month: 'Mar', demand: 102 },
    { month: 'Abr', demand: 110 },
    { month: 'May', demand: 115 },
    { month: 'Jun', demand: 128 },
  ],
  estimatedSeniority: 'Mid-Senior',
  seniorityYearsBasis: 5,
  compatibleRoles: [
    { title: 'Backend Java Developer', match: 'Alta' },
    { title: 'Java Cloud Engineer', match: 'Alta' },
    { title: 'Backend Microservices Developer', match: 'Media' },
  ],
  aiInsight: 'Los perfiles Backend Java con Kubernetes y AWS tienen 2.3x mas salarios promedio 32% más altos en el mercado peruano.',
  totalSkillsDetected: 24,
  domainsCovered: 5,
};
