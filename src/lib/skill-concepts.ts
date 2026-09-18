/**
 * Resolves conceptual relation tags for a given technical skill.
 * Replaces generic/redundant 'tech' tags with meaningful concepts
 * (e.g., Lenguaje, Framework, Arquitectura, Base de Datos, Cloud, DevOps).
 */
export function getSkillConcepts(
  skillName: string,
  domainTags?: string[],
  coreDomains?: string[]
): string[] {
  const nameLower = skillName.toLowerCase();
  const concepts = new Set<string>();

  // 1. Check explicit domain_tags & core_domains if provided
  if (coreDomains && coreDomains.length > 0) {
    coreDomains.forEach((d) => {
      if (d && d.toLowerCase() !== 'tech' && d.toLowerCase() !== 'hard_skill') {
        concepts.add(d);
      }
    });
  }

  if (domainTags && domainTags.length > 0) {
    domainTags.forEach((t) => {
      const clean = t.trim();
      if (
        clean &&
        clean.toLowerCase() !== 'tech' &&
        clean.toLowerCase() !== 'unknown' &&
        clean.toLowerCase() !== nameLower
      ) {
        concepts.add(clean.charAt(0).toUpperCase() + clean.slice(1));
      }
    });
  }

  // 2. Extract taxonomy from parenthetical suffix if present e.g. "Java (Programming Language)"
  const parentheticalMatch = skillName.match(/\(([^)]+)\)/);
  if (parentheticalMatch && parentheticalMatch[1]) {
    const rawCategory = parentheticalMatch[1].trim().toLowerCase();
    if (rawCategory.includes('programming language')) {
      concepts.add('Lenguaje');
    } else if (rawCategory.includes('web framework') || rawCategory.includes('framework')) {
      concepts.add('Framework');
    } else if (rawCategory.includes('software')) {
      concepts.add('Herramienta');
    } else {
      concepts.add(parentheticalMatch[1].trim());
    }
  }

  // 3. Known technical taxonomy mapping for common stacks
  if (nameLower.includes('java') && !nameLower.includes('javascript')) {
    concepts.add('Lenguaje');
    concepts.add('OOP');
    concepts.add('Backend');
  } else if (
    nameLower.includes('sql') ||
    nameLower.includes('postgres') ||
    nameLower.includes('mysql') ||
    nameLower.includes('oracle')
  ) {
    concepts.add('Lenguaje');
    concepts.add('Base de Datos');
    concepts.add('Relacional');
  } else if (
    nameLower.includes('jenkins') ||
    nameLower.includes('github actions') ||
    nameLower.includes('gitlab')
  ) {
    concepts.add('CI/CD');
    concepts.add('DevOps');
    concepts.add('Automatización');
  } else if (nameLower.includes('spring')) {
    concepts.add('Framework');
    concepts.add('Backend');
    concepts.add('Java');
  } else if (
    nameLower.includes('jira') ||
    nameLower.includes('confluence') ||
    nameLower.includes('trello')
  ) {
    concepts.add('Gestión Ágil');
    concepts.add('Scrum');
  } else if (nameLower.includes('docker')) {
    concepts.add('Contenedores');
    concepts.add('DevOps');
    concepts.add('Virtualización');
  } else if (nameLower.includes('angular')) {
    concepts.add('Framework Web');
    concepts.add('Frontend');
    concepts.add('TypeScript');
  } else if (
    nameLower.includes('react') ||
    nameLower.includes('next.js') ||
    nameLower.includes('nextjs')
  ) {
    concepts.add('Librería UI');
    concepts.add('Frontend');
    concepts.add('SPA');
  } else if (
    nameLower.includes('node') ||
    nameLower.includes('express') ||
    nameLower.includes('nest')
  ) {
    concepts.add('Runtime');
    concepts.add('Backend');
    concepts.add('JavaScript');
  } else if (nameLower.includes('mongo')) {
    concepts.add('Base de Datos');
    concepts.add('NoSQL');
    concepts.add('Documental');
  } else if (
    nameLower.includes('azure') ||
    nameLower.includes('aws') ||
    nameLower.includes('gcp') ||
    nameLower.includes('cloud')
  ) {
    concepts.add('Cloud');
    concepts.add('Infraestructura');
  } else if (nameLower.includes('microservicio') || nameLower.includes('microservice')) {
    concepts.add('Arquitectura');
    concepts.add('Backend');
    concepts.add('Sistemas Distribuidos');
  } else if (nameLower.includes('kubernetes') || nameLower.includes('k8s')) {
    concepts.add('Orquestación');
    concepts.add('Contenedores');
    concepts.add('DevOps');
  } else if (
    nameLower.includes('javascript') ||
    nameLower.includes('typescript') ||
    nameLower.includes('python') ||
    nameLower.includes('golang') ||
    nameLower.includes('c#') ||
    nameLower.includes('php') ||
    nameLower.includes('ruby')
  ) {
    concepts.add('Lenguaje');
    if (nameLower.includes('javascript') || nameLower.includes('typescript')) {
      concepts.add('Frontend');
    }
    if (
      nameLower.includes('python') ||
      nameLower.includes('golang') ||
      nameLower.includes('c#')
    ) {
      concepts.add('Backend');
    }
  } else if (nameLower.includes('redis')) {
    concepts.add('Caché');
    concepts.add('NoSQL');
    concepts.add('En Memoria');
  } else if (nameLower.includes('kafka') || nameLower.includes('rabbitmq')) {
    concepts.add('Mensajería');
    concepts.add('Event-Driven');
    concepts.add('Backend');
  } else if (
    nameLower.includes('graphql') ||
    nameLower.includes('rest') ||
    nameLower.includes('api')
  ) {
    concepts.add('API');
    concepts.add('Integración');
  } else if (nameLower.includes('git')) {
    concepts.add('Control de Versiones');
    concepts.add('DevOps');
  } else if (nameLower.includes('linux')) {
    concepts.add('Sistema Operativo');
    concepts.add('Infraestructura');
  }

  if (concepts.size === 0) {
    concepts.add('Concepto Técnico');
  }

  return Array.from(concepts).slice(0, 3);
}
