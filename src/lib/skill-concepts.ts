/**
 * Taxonomy and conceptual relation mapping for technical skills.
 * Establishes a 3-tier ontology:
 * 1. Macro-Domains (Cloud, Backend, Frontend, DevOps, Database, Architecture, QA, Data, Mobile, Security)
 * 2. Micro-Concepts / Paradigms (OOP, Relacional, NoSQL, Event-Driven, CI/CD, Containerization, In-Memory, etc.)
 * 3. Specific Technologies / Tools (Java, Docker, PostgreSQL, React, AWS, etc.)
 */

// 1. Set of Macro-Domains (used for Cluster Conceptual Coverage & Radar, excluded from Micro-Concepts)
export const MACRO_DOMAINS = new Set([
  'backend',
  'frontend',
  'cloud',
  'devops',
  'base de datos',
  'bases de datos',
  'database',
  'infraestructura',
  'infrastructure',
  'arquitectura',
  'architecture',
  'data',
  'qa',
  'qa / testing',
  'testing',
  'mobile',
  'seguridad',
  'security',
  'general',
]);

// 2. Blacklist of raw technology/language names and meta-categories that must never appear as micro-concepts
const EXCLUDED_TECH_AND_META = new Set([
  'java',
  'javascript',
  'typescript',
  'python',
  'golang',
  'go',
  'c#',
  'c++',
  'php',
  'ruby',
  'rust',
  'scala',
  'kotlin',
  'swift',
  'dart',
  'sql',
  'html',
  'css',
  'sass',
  'bash',
  'shell',
  'powershell',
  'lenguaje',
  'lenguajes',
  'framework',
  'framework web',
  'librería ui',
  'libreria ui',
  'herramienta',
  'herramientas',
  'runtime',
  'software',
  'sistema operativo',
  'sistemas operativos',
  'concepto técnico',
  'concepto tecnico',
  'tech',
  'hard_skill',
  'unknown',
  'null',
  'undefined',
]);

/**
 * Resolves the primary Macro-Domain for a given technical skill.
 * Used for Grouping in Cluster Conceptual Coverage.
 */
export function getSkillMacroDomain(
  skillName: string,
  domainTags?: string[],
  coreDomains?: string[]
): string {
  const nl = skillName.toLowerCase();

  // 1. Check direct matches by name keywords
  if (
    nl.includes('microservicio') ||
    nl.includes('microservice') ||
    nl.includes('arquitectura') ||
    nl.includes('clean arch') ||
    nl.includes('hexagonal') ||
    nl.includes('system design')
  ) {
    return 'Arquitectura';
  }

  if (
    nl.includes('docker') ||
    nl.includes('kubernetes') ||
    nl.includes('k8s') ||
    nl.includes('jenkins') ||
    nl.includes('ci/cd') ||
    nl.includes('actions') ||
    nl.includes('gitlab') ||
    nl.includes('ansible') ||
    nl.includes('terraform') ||
    nl.includes('linux') ||
    nl.includes('git')
  ) {
    return 'DevOps';
  }

  if (
    nl.includes('aws') ||
    nl.includes('azure') ||
    nl.includes('gcp') ||
    nl.includes('cloud') ||
    nl.includes('serverless') ||
    nl.includes('lambda')
  ) {
    return 'Cloud';
  }

  if (
    nl.includes('sql') ||
    nl.includes('postgres') ||
    nl.includes('mysql') ||
    nl.includes('mongo') ||
    nl.includes('redis') ||
    nl.includes('oracle') ||
    nl.includes('database') ||
    nl.includes('dynamodb') ||
    nl.includes('cassandra')
  ) {
    return 'Base de Datos';
  }

  if (
    nl.includes('react') ||
    nl.includes('angular') ||
    nl.includes('vue') ||
    nl.includes('frontend') ||
    nl.includes('next.js') ||
    nl.includes('tailwind') ||
    nl.includes('html') ||
    nl.includes('css')
  ) {
    return 'Frontend';
  }

  if (
    nl.includes('test') ||
    nl.includes('jest') ||
    nl.includes('cypress') ||
    nl.includes('playwright') ||
    nl.includes('selenium') ||
    nl.includes('qa')
  ) {
    return 'QA / Testing';
  }

  if (
    nl.includes('kafka') ||
    nl.includes('rabbitmq') ||
    nl.includes('spark') ||
    nl.includes('hadoop') ||
    nl.includes('airflow') ||
    nl.includes('etl')
  ) {
    return 'Data';
  }

  if (
    nl.includes('node') ||
    nl.includes('express') ||
    nl.includes('nest') ||
    nl.includes('spring') ||
    nl.includes('django') ||
    nl.includes('fastapi') ||
    nl.includes('laravel') ||
    nl.includes('backend') ||
    nl.includes('java') ||
    nl.includes('c#') ||
    nl.includes('golang') ||
    nl.includes('ruby') ||
    nl.includes('api') ||
    nl.includes('graphql')
  ) {
    return 'Backend';
  }

  // 2. Check explicit coreDomains / domainTags if available
  if (coreDomains && coreDomains.length > 0) {
    for (const d of coreDomains) {
      const clean = d.toLowerCase().trim();
      if (clean === 'backend') return 'Backend';
      if (clean === 'frontend') return 'Frontend';
      if (clean === 'cloud') return 'Cloud';
      if (clean === 'devops') return 'DevOps';
      if (clean === 'data') return 'Data';
      if (clean === 'qa') return 'QA / Testing';
      if (clean === 'mobile') return 'Mobile';
    }
  }

  return 'General';
}

/**
 * Resolves genuine Micro-Concepts (paradigms, patterns, architectural principles) for a skill.
 * Strictly excludes Macro-Domains, language/tool names, and meta-categories.
 */
export function getSkillMicroConcepts(
  skillName: string,
  domainTags?: string[],
  coreDomains?: string[]
): string[] {
  const nl = skillName.toLowerCase();
  const concepts = new Set<string>();

  // Extract valid concepts from domainTags if present
  if (domainTags && Array.isArray(domainTags)) {
    for (const tag of domainTags) {
      if (!tag) continue;
      const clean = tag.trim();
      const cl = clean.toLowerCase();
      if (!MACRO_DOMAINS.has(cl) && !EXCLUDED_TECH_AND_META.has(cl) && clean.length > 2) {
        concepts.add(clean);
      }
    }
  }

  // Extract valid concepts from coreDomains if present
  if (coreDomains && Array.isArray(coreDomains)) {
    for (const cd of coreDomains) {
      if (!cd) continue;
      const clean = cd.trim();
      const cl = clean.toLowerCase();
      if (!MACRO_DOMAINS.has(cl) && !EXCLUDED_TECH_AND_META.has(cl) && clean.length > 2) {
        concepts.add(clean);
      }
    }
  }

  // Heuristic paradigm & pattern resolution based on the skill
  if (nl.includes('java') && !nl.includes('javascript')) {
    concepts.add('OOP');
    concepts.add('Tipado Estático');
    concepts.add('Concurrencia (JVM)');
  } else if (nl.includes('spring')) {
    concepts.add('Inyección de Dependencias');
    concepts.add('Inversión de Control (IoC)');
    concepts.add('API REST');
  } else if (
    nl.includes('postgres') ||
    nl.includes('mysql') ||
    nl.includes('oracle') ||
    nl.includes('sql')
  ) {
    concepts.add('Modelo Relacional');
    concepts.add('Transaccionalidad (ACID)');
    concepts.add('Indexación');
  } else if (nl.includes('mongo')) {
    concepts.add('NoSQL');
    concepts.add('Modelo Documental');
    concepts.add('Esquema Flexible');
  } else if (nl.includes('redis')) {
    concepts.add('In-Memory Caching');
    concepts.add('NoSQL');
    concepts.add('Clave-Valor');
  } else if (nl.includes('kafka') || nl.includes('rabbitmq')) {
    concepts.add('Arquitectura Event-Driven');
    concepts.add('Mensajería Asíncrona');
    concepts.add('Streaming');
  } else if (nl.includes('docker')) {
    concepts.add('Contenedorización');
    concepts.add('Virtualización Ligera');
    concepts.add('Inmutabilidad');
  } else if (nl.includes('kubernetes') || nl.includes('k8s')) {
    concepts.add('Orquestación');
    concepts.add('Auto-scaling');
    concepts.add('Service Discovery');
  } else if (
    nl.includes('jenkins') ||
    nl.includes('github actions') ||
    nl.includes('gitlab')
  ) {
    concepts.add('CI/CD');
    concepts.add('Automatización de Despliegue');
    concepts.add('Pipelines as Code');
  } else if (nl.includes('git')) {
    concepts.add('Control de Versiones');
    concepts.add('GitFlow / Branching');
  } else if (nl.includes('microservicio') || nl.includes('microservice')) {
    concepts.add('Sistemas Distribuidos');
    concepts.add('Desacoplamiento');
    concepts.add('API Gateway');
  } else if (nl.includes('graphql')) {
    concepts.add('API Design');
    concepts.add('Declarative Data Fetching');
    concepts.add('Schema Definition');
  } else if (nl.includes('rest') || nl.includes('api')) {
    concepts.add('API REST');
    concepts.add('Statelessness');
    concepts.add('Contratos JSON/HTTP');
  } else if (
    nl.includes('react') ||
    nl.includes('next.js') ||
    nl.includes('nextjs')
  ) {
    concepts.add('SPA');
    concepts.add('SSR / Hydration');
    concepts.add('Component-Driven');
    concepts.add('Virtual DOM');
  } else if (nl.includes('angular')) {
    concepts.add('SPA');
    concepts.add('Reactividad (RxJS/Signals)');
    concepts.add('Inyección de Dependencias');
  } else if (nl.includes('node') || nl.includes('express') || nl.includes('nest')) {
    concepts.add('Event Loop / Asincronía');
    concepts.add('I/O No Bloqueante');
    if (nl.includes('nest')) {
      concepts.add('Inyección de Dependencias');
      concepts.add('Modularidad');
    }
  } else if (nl.includes('typescript')) {
    concepts.add('Tipado Estático');
    concepts.add('Inferencia de Tipos');
  } else if (nl.includes('python')) {
    concepts.add('Tipado Dinámico');
    concepts.add('Multi-paradigma');
  } else if (nl.includes('terraform') || nl.includes('ansible')) {
    concepts.add('IaC (Infrastructure as Code)');
    concepts.add('Aprovisionamiento Declarativo');
  } else if (
    nl.includes('aws') ||
    nl.includes('azure') ||
    nl.includes('gcp') ||
    nl.includes('cloud')
  ) {
    concepts.add('Alta Disponibilidad');
    concepts.add('Escalabilidad Horizontal');
    concepts.add('Serverless');
  } else if (
    nl.includes('jira') ||
    nl.includes('scrum') ||
    nl.includes('agile')
  ) {
    concepts.add('Gestión Ágil');
    concepts.add('Scrum / Sprints');
  } else if (
    nl.includes('jest') ||
    nl.includes('cypress') ||
    nl.includes('playwright') ||
    nl.includes('test')
  ) {
    concepts.add('TDD');
    concepts.add('Pruebas Automatizadas');
    concepts.add('Cobertura de Código');
  } else if (nl.includes('linux')) {
    concepts.add('CLI / Shell Scripting');
    concepts.add('Gestión de Procesos');
  }

  // Filter out any unwanted macro-domains or technology names that might have been added
  const filtered: string[] = [];
  concepts.forEach((c) => {
    const cl = c.toLowerCase().trim();
    if (!MACRO_DOMAINS.has(cl) && !EXCLUDED_TECH_AND_META.has(cl) && cl.length > 1) {
      filtered.push(c);
    }
  });

  return filtered.slice(0, 3);
}

/**
 * Resolves conceptual tags for a skill (Macro-Domain first, followed by Micro-Concepts).
 * Kept for backward compatibility across drawers and detail views.
 */
export function getSkillConcepts(
  skillName: string,
  domainTags?: string[],
  coreDomains?: string[]
): string[] {
  const macro = getSkillMacroDomain(skillName, domainTags, coreDomains);
  const micros = getSkillMicroConcepts(skillName, domainTags, coreDomains);
  return [macro, ...micros].slice(0, 3);
}
