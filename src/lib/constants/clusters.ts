export type ClusterSkillImportance = 'critical' | 'high' | 'medium';

export interface ClusterSkill {
  name: string;
  category: string;
  importance: ClusterSkillImportance;
  demandPercentage: number;
}

export const CLUSTER_SKILLS_MAP: Record<string, ClusterSkill[]> = {
  'Backend Java': [
    { name: 'Java', category: 'hard_skill', importance: 'critical', demandPercentage: 92 },
    { name: 'Spring Boot', category: 'hard_skill', importance: 'critical', demandPercentage: 88 },
    { name: 'REST APIs', category: 'hard_skill', importance: 'high', demandPercentage: 80 },
    { name: 'Microservicios', category: 'hard_skill', importance: 'high', demandPercentage: 82 },
    { name: 'PostgreSQL', category: 'hard_skill', importance: 'high', demandPercentage: 74 },
    { name: 'AWS', category: 'hard_skill', importance: 'high', demandPercentage: 62 },
    { name: 'Docker', category: 'tool', importance: 'high', demandPercentage: 70 },
    { name: 'Kubernetes', category: 'tool', importance: 'medium', demandPercentage: 55 },
    { name: 'Git', category: 'tool', importance: 'medium', demandPercentage: 90 },
  ],
  'Backend Python': [
    { name: 'Python', category: 'hard_skill', importance: 'critical', demandPercentage: 95 },
    { name: 'FastAPI', category: 'hard_skill', importance: 'critical', demandPercentage: 82 },
    { name: 'REST APIs', category: 'hard_skill', importance: 'high', demandPercentage: 85 },
    { name: 'PostgreSQL', category: 'hard_skill', importance: 'high', demandPercentage: 78 },
    { name: 'MongoDB', category: 'hard_skill', importance: 'high', demandPercentage: 60 },
    { name: 'AWS', category: 'hard_skill', importance: 'high', demandPercentage: 68 },
    { name: 'Docker', category: 'tool', importance: 'high', demandPercentage: 75 },
    { name: 'Redis', category: 'hard_skill', importance: 'medium', demandPercentage: 55 },
    { name: 'Git', category: 'tool', importance: 'medium', demandPercentage: 92 },
  ],
  'Frontend React': [
    { name: 'React', category: 'hard_skill', importance: 'critical', demandPercentage: 96 },
    { name: 'Next.js', category: 'hard_skill', importance: 'critical', demandPercentage: 85 },
    { name: 'JavaScript', category: 'hard_skill', importance: 'critical', demandPercentage: 94 },
    { name: 'TypeScript', category: 'hard_skill', importance: 'high', demandPercentage: 88 },
    { name: 'HTML5', category: 'hard_skill', importance: 'high', demandPercentage: 90 },
    { name: 'CSS3', category: 'hard_skill', importance: 'high', demandPercentage: 90 },
    { name: 'Tailwind CSS', category: 'tool', importance: 'medium', demandPercentage: 82 },
    { name: 'Git', category: 'tool', importance: 'medium', demandPercentage: 92 },
  ],
  'DevOps Cloud': [
    { name: 'Docker', category: 'tool', importance: 'critical', demandPercentage: 94 },
    { name: 'Kubernetes', category: 'tool', importance: 'critical', demandPercentage: 88 },
    { name: 'Terraform', category: 'tool', importance: 'critical', demandPercentage: 80 },
    { name: 'AWS', category: 'hard_skill', importance: 'high', demandPercentage: 85 },
    { name: 'Linux', category: 'hard_skill', importance: 'high', demandPercentage: 78 },
    { name: 'CI/CD', category: 'methodology', importance: 'high', demandPercentage: 90 },
    { name: 'Git', category: 'tool', importance: 'medium', demandPercentage: 95 },
  ],
  'Data Engineering': [
    { name: 'Python', category: 'hard_skill', importance: 'critical', demandPercentage: 92 },
    { name: 'Spark', category: 'hard_skill', importance: 'critical', demandPercentage: 88 },
    { name: 'SQL', category: 'hard_skill', importance: 'critical', demandPercentage: 90 },
    { name: 'Kafka', category: 'tool', importance: 'high', demandPercentage: 75 },
    { name: 'Airflow', category: 'tool', importance: 'high', demandPercentage: 80 },
    { name: 'Snowflake', category: 'tool', importance: 'high', demandPercentage: 65 },
    { name: 'NoSQL', category: 'hard_skill', importance: 'medium', demandPercentage: 70 },
    { name: 'Docker', category: 'tool', importance: 'medium', demandPercentage: 60 },
    { name: 'Git', category: 'tool', importance: 'medium', demandPercentage: 85 },
  ],
  'QA & Automation': [
    { name: 'QA', category: 'hard_skill', importance: 'critical', demandPercentage: 90 },
    { name: 'Selenium', category: 'tool', importance: 'critical', demandPercentage: 85 },
    { name: 'Cypress', category: 'tool', importance: 'high', demandPercentage: 78 },
    { name: 'SQL', category: 'hard_skill', importance: 'high', demandPercentage: 80 },
    { name: 'Postman', category: 'tool', importance: 'high', demandPercentage: 75 },
    { name: 'Python', category: 'hard_skill', importance: 'medium', demandPercentage: 70 },
    { name: 'Git', category: 'tool', importance: 'medium', demandPercentage: 88 },
  ],
};

export const getClusterKey = (name: string): string => {
  const n = name.toLowerCase();
  if (n.includes('java')) return 'Backend Java';
  if (n.includes('python')) return 'Backend Python';
  if (n.includes('frontend') || n.includes('react')) return 'Frontend React';
  if (n.includes('devops') || n.includes('cloud')) return 'DevOps Cloud';
  if (n.includes('data')) return 'Data Engineering';
  if (n.includes('qa') || n.includes('automation')) return 'QA & Automation';
  return name;
};
