# Arquitectura Técnica Integral del Sistema de Perfilamiento y Alineación de Competencias TI

## 1. Objetivo del Sistema

Desarrollar una plataforma web inteligente capaz de:

* Analizar automáticamente el CV de un desarrollador.
* Identificar su perfil tecnológico dominante.
* Compararlo contra la demanda real del mercado TI peruano.
* Detectar brechas de competencias.
* Priorizar habilidades a desarrollar.
* Recomendar rutas de especialización basadas en evidencia de mercado.

---

# 2. Stack Tecnológico

## Frontend

### Framework

* Next.js 16
* TypeScript
* TailwindCSS
* Shadcn UI

### Funciones

* Autenticación
* Dashboard
* Upload de CV
* Visualización de diagnóstico
* Visualización de perfiles
* Roadmap de aprendizaje

---

## Backend

### Framework

* FastAPI

### Responsabilidades

* Procesamiento de CV
* NLP
* Motor de alineación
* Detección de brechas
* Exposición de APIs REST
* Integración con Supabase

---

## Base de Datos

### Plataforma

* Supabase PostgreSQL

### Funciones

* Almacenamiento de ofertas
* Skills normalizadas
* Taxonomía
* Perfiles tecnológicos
* Resultados de clustering
* Resultados de análisis de usuarios

---

## Infraestructura

### Hosting

Frontend:

* Vercel

Backend:

* Koyeb / Railway / Render / VPS

Base de datos:

* Supabase

---

# 3. Arquitectura General

## Flujo Offline

Mercado Laboral
↓
Scraping
↓
Normalización
↓
Taxonomía
↓
Matriz de Competencias
↓
K-Modes
↓
Perfiles Tecnológicos
↓
Análisis Estadístico
↓
Base de Conocimiento

---

## Flujo Online

CV Usuario
↓
NLP
↓
Extracción de Skills
↓
Normalización
↓
Vectorización
↓
Weighted Jaccard
↓
Perfil Más Cercano
↓
Detección de Brechas
↓
Priorización
↓
Recomendaciones

---

# 4. Módulo de Scraping

## Repositorio Independiente

Repositorio:

devalign-scraping

Lenguaje:

Python

---

## Fuentes Iniciales

* LinkedIn Jobs
* GetOnBoard
* Computrabajo

---

## Frecuencia

Diaria

GitHub Actions:

```yaml
cron: "0 3 * * *"
```

---

## Flujo

Portal
↓
Extracción HTML/API
↓
Limpieza
↓
Normalización
↓
Carga a Supabase

---

## Datos Extraídos

Título

Descripción

Hard Skills

Soft Skills

Nivel

Ubicación

Fecha

Empresa

Tecnologías

---

# 5. NLP de Ofertas Laborales

## Objetivo

Convertir texto libre en competencias estructuradas.

---

## Librerías

* spaCy
* Regex personalizadas
* Diccionario de Skills

---

## Ejemplo

Input:

```text
Experiencia con Spring Boot,
Docker y PostgreSQL.
```

Output:

```json
[
  "Spring Boot",
  "Docker",
  "PostgreSQL"
]
```

---

# 6. Taxonomía Tecnológica

## Objetivo

Estandarizar competencias.

---

## Estructura

### Lenguajes

* Java
* Python
* JavaScript
* TypeScript
* C#

### Frameworks

* Spring Boot
* FastAPI
* NestJS
* React
* Angular

### Bases de Datos

* PostgreSQL
* MySQL
* MongoDB

### Cloud

* AWS
* Azure
* GCP

### DevOps

* Docker
* Kubernetes
* Jenkins

### Metodologías

* Scrum
* Kanban
* Microservicios

---

# 7. Normalización de Skills

## Problema

Una misma skill puede aparecer escrita de múltiples formas.

Ejemplos:

```text
Postgres
PostgreSQL

Node
Node.js

AWS
Amazon Web Services
```

---

## Solución

Diccionario canónico.

```json
{
  "Postgres": "PostgreSQL",
  "Node": "Node.js",
  "Amazon Web Services": "AWS"
}
```

---

# 8. Modelo de Datos

## Tabla Skills

```sql
id
nombre
categoria
peso
```

---

## Tabla JobOffers

```sql
id
titulo
empresa
descripcion
fecha
```

---

## Tabla JobOfferSkills

```sql
offer_id
skill_id
```

---

## Tabla Clusters

```sql
id
nombre
descripcion
```

---

## Tabla ClusterSkills

```sql
cluster_id
skill_id
frecuencia
```

---

# 9. Construcción de la Matriz de Competencias

## Estructura

Filas:

Ofertas laborales

Columnas:

Skills

Valores:

```text
0 = no presente
1 = presente
```

Ejemplo:

| Oferta | Java | Spring | Docker | AWS |
| ------ | ---- | ------ | ------ | --- |
| 1      | 1    | 1      | 0      | 0   |
| 2      | 1    | 1      | 1      | 1   |

---

# 10. Descubrimiento de Perfiles

## Algoritmo

K-Modes

---

## Justificación

Las competencias son variables categóricas binarias.

K-Means no es adecuado.

K-Modes genera perfiles interpretables.

---

## Resultado Esperado

### Cluster 1

Backend Java Enterprise

### Cluster 2

Backend Python

### Cluster 3

Fullstack JavaScript

### Cluster 4

Frontend React

### Cluster 5

DevOps Cloud

---

# 11. Perfilamiento de Usuario

## Entrada

CV PDF

---

## Extracción

PDF
↓
Texto
↓
NLP
↓
Skills

---

## Resultado

```json
{
  "skills": [
    "Java",
    "Spring Boot",
    "SQL"
  ]
}
```

---

# 12. Motor de Alineación

## Algoritmo

Weighted Jaccard Similarity

---

## Fórmula Conceptual

Intersección ponderada

dividido por

Unión ponderada

---

## Pesos

### Crítica

3

### Importante

2

### Deseable

1

---

## Resultado

```json
{
  "backend_java": 0.81,
  "backend_python": 0.27,
  "frontend_react": 0.18
}
```

---

# 13. Detección de Brechas

Perfil Objetivo:

```text
Java
Spring
Docker
AWS
PostgreSQL
```

Usuario:

```text
Java
Spring
```

Brechas:

```text
Docker
AWS
PostgreSQL
```

---

# 14. Priorización de Competencias

## Fórmula

Prioridad =
Peso de Mercado × Frecuencia

---

## Ejemplo

Docker

74% ofertas

Peso 3

Prioridad Alta

---

AWS

61% ofertas

Peso 2

Prioridad Media

---

Redis

15% ofertas

Peso 1

Prioridad Baja

---

# 15. Motor de Recomendación

## MVP

Basado en reglas.

---

## Ejemplo

Si:

```text
Java
Spring
```

Y faltan:

```text
Docker
PostgreSQL
```

Entonces recomendar:

1. Docker
2. PostgreSQL

---

# 16. FP-Growth (Fase 2)

## Objetivo

Descubrir tecnologías complementarias.

---

## Ejemplo

```text
Java + Spring
→ Docker

Java + Spring
→ PostgreSQL

Java + Spring
→ Kubernetes
```

---

## Uso

No participa en el cálculo principal de alineación.

Solo en recomendaciones avanzadas.

---

# 17. APIs Principales

Las siguientes son las rutas reales consumidas por el Frontend hacia el Backend (FastAPI). Todo cuenta con prefijo `/api/v1`.

## Gestión de Usuario y CV

`GET /api/v1/users/me`
Obtiene la sesión del usuario actual (o aprovisiona JIT desde Supabase).

`POST /api/v1/users/me/cv`
Sube el documento CV (PDF/DOCX) e inicia el análisis asíncrono.

`GET /api/v1/users/me/cvs`
Lista los CVs subidos por el usuario.

---

## Perfil y Diagnóstico (ML Engine)

`POST /api/v1/profile/analyze`
Sube y analiza el CV para generar el perfil de desarrollador mediante K-Prototypes y Embeddings (devuelve 202).

`GET /api/v1/profile/me`
Obtiene el perfil calculado del desarrollador autenticado (Vista Alineación / Diagnóstico).

**Esquema de Respuesta Esperado (JSON):**

```json
{
  "summary": {
    "alignment_score": 66,
    "alignment_label": "Media afinidad",
    "primary_cluster": "Data Engineering",
    "cluster_distribution": [
      { "name": "DevOps", "affinity_percentage": 63 },
      { "name": "Data Engineering", "affinity_percentage": 41 }
    ]
  },
  "radar_chart": {
    "domains": ["Backend", "Frontend", "Cloud", "DevOps", "Data"],
    "datasets": {
      "user": [40, 20, 60, 50, 70],
      "market": [80, 30, 70, 60, 85]
    }
  },
  "strengths": [
    {
      "skill_name": "SQL Server",
      "user_level": "Avanzado",
      "market_demand_percentage": 80
    },
    {
      "skill_name": "Python",
      "user_level": "Intermedio - Avanzado",
      "market_demand_percentage": 65
    }
  ],
  "gaps": [
    {
      "skill_name": "REST APIs",
      "severity": "Crítica",
      "market_demand_percentage": 74
    },
    {
      "skill_name": "Microservicios",
      "severity": "Crítica",
      "market_demand_percentage": 68
    },
    {
      "skill_name": "Node.js",
      "severity": "Alta",
      "market_demand_percentage": 61
    }
  ],
  "compatible_roles": [
    {
      "role_title": "Backend Java Developer",
      "affinity_label": "Alta"
    },
    {
      "role_title": "Java Cloud Engineer",
      "affinity_label": "Alta"
    },
    {
      "role_title": "Data Engineer Junior",
      "affinity_label": "Media"
    }
  ],
  "market_insights": {
    "cluster_demand": {
      "metric_value": 28,
      "trend": "positive",
      "label": "Crecimiento laboral",
      "description": "Las ofertas para la especialidad Practicante en Gestión de Información Financiera se han incrementado en los últimos 6 meses en el mercado regional."
    },
    "salary_differential": {
      "metric_value": 32,
      "trend": "positive",
      "label": "Diferencial Salarial",
      "description": "Los profesionales que dominan REST APIs y microservicios perciben ingresos promedio 32% más altos (2.3x) en vacantes locales."
    }
  },
  "action_recommendation": {
    "target_skills": ["REST APIs", "microservicios"],
    "projected_alignment_increase_percentage": 18,
    "text": "Fortalecer habilidades clave como **REST APIs** y **microservicios** podría aumentar tu alineación con el mercado en **+18%**."
  }
}
```

`PATCH /api/v1/profile/me`
Actualiza campos manuales del perfil (experiencia, educación, etc.).

`PUT /api/v1/profile/skills`
Actualiza (sobreescribe) las habilidades manuales del perfil (corregir validación del parser).

---

## Mercado y Clusters

`GET /api/v1/profile/clusters`
Lista las especialidades tecnológicas descubiertas.

`POST /api/v1/profile/normalize-skills`
Inicia pipeline de normalización de ofertas de trabajo.

---

## Roadmap (GenAI)

`POST /api/v1/roadmap/generate`
Genera una ruta de aprendizaje estructurada mediante RAG + LLM.

---

# 18. Roadmap Futuro

## Fase 2

* FP-Growth avanzado
* Tendencias temporales
* Embeddings para extracción semántica

## Fase 3

* LLM para explicación personalizada
* Generación automática de planes de estudio
* Recomendación de cursos
* Predicción de empleabilidad

---

# Principio Rector

El activo principal del sistema no es el clustering ni el scraping.

El activo principal es la Base de Conocimiento de Competencias construida a partir de la demanda real del mercado y utilizada para medir objetivamente la alineación técnica de un desarrollador.
