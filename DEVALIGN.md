# Devalign — Diseño Funcional de Vistas (Versión MVP Tesis)

## Objetivo General

La aplicación tiene como objetivo evaluar la alineación de competencias técnicas de desarrolladores con las demandas del mercado laboral TI mediante un motor de inferencia basado en Machine Learning (Clustering y Reglas de Asociación).

La experiencia del usuario se centra en un flujo continuo de:
1. Cargar el Currículum Vitae (CV) como entrada única.
2. Validar y corregir los datos extraídos por el parser (Perfil).
3. Visualizar el nivel de alineación y brechas frente al mercado (Diagnóstico).
4. Obtener una ruta de aprendizaje justificada por datos (Roadmap).

---

# Flujo de Experiencia del Usuario (Secuencia MVP)

Para evitar la entrada de datos manual tediosa y guiar al usuario hacia el valor del motor de inferencia, el sistema sigue un flujo secuencial estricto:

```
[ Registro / Login ] 
         │
         ▼
[ Paso 1: Onboarding / Carga de CV ] ─── (Entrada única obligatoria)
         │
         ▼
[ Paso 2: Validación de Perfil ] ─────── (Edición de Habilidades, Experiencia y Certificaciones extraídas)
         │
         ▼
[ Paso 3: Dashboard de Diagnóstico ] ─── (Visualización de Score, Radar y Brechas Prioritarias)
         │
         ▼
[ Paso 4: Roadmap e Insights ] ───────── (Ruta de aprendizaje justificada por FP-Growth y Clusters)
```

---

# Estructura General de Navegación

El sistema utiliza el App Router de Next.js. Las rutas se dividen en dos grupos principales y un acceso público:

1. **Zona Privada Protegida (Bajo `/dashboard/*`):**
   * `/dashboard` — Panel de Diagnóstico & Perfil Unificado.
   * `/dashboard/roadmap` — Ruta de Crecimiento & Contexto de Mercado.
   * *Ajustes de Cuenta* — Accedido mediante un modal flotante (`Dialog`) desde la barra lateral, sin página dedicada.

2. **Acceso Público Desprotegido:**
   * `/public/share/:diagnosticId` — Vista de lectura optimizada para portafolios y LinkedIn (sin barra lateral ni controles de edición).

---

# Estructura y Comportamiento del Shell del Dashboard

El diseño del Dashboard consta de un contenedor global estructurado de la siguiente manera:

* **Barra Lateral Izquierda (Sidebar - Ancho Fijo):**
   * **Sección de Navegación:** Enlaces directos a `Diagnóstico` (`/dashboard`) y `Roadmap` (`/dashboard/roadmap`).
   * **Sección de Documento (CV Toolcard):** Concentra todas las operaciones de archivos en un único lugar para evitar duplicidades en el contenido principal.
     * Muestra el nombre del archivo PDF activo analizado y su tamaño.
     * Acción 1: "Actualizar CV" (permite cargar un nuevo documento para re-analizar).
     * Acción 2: "Generar CV ATS" (permite descargar la versión optimizada en formato ATS del CV basada en las correcciones realizadas en el perfil).
   * **Sección de Usuario:** Avatar, enlace a perfil de cuenta y acceso directo al modal de Ajustes.
* **Contenedor de Contenido Principal (Ancho Flexible / Scroll Asimétrico):**
   * Ocupa el espacio restante al costado del Sidebar.
   * En `/dashboard`, implementa una grilla simétrica de **50% / 50%** entre el Panel de Perfil (Input) y el Panel de Diagnóstico (Output).

---

# Vista 1: Dashboard de Diagnóstico & Perfil (`/dashboard`)

## Objetivo

Visualizar de forma paralela la edición del perfil y los resultados del diagnóstico. El usuario modifica sus datos y observa el cambio inmediato en su score de alineación y radar sin abandonar la vista.

## Componentes del Contenido Principal (Grilla 50% / 50%)

### 1. Panel de Entrada de Datos (Perfil de Competencias — Columna Izquierda)

* **Cabecera de Perfil Simplificada:**
  * Nombre del desarrollador, rol actual y el **Seniority Estimado** inferido por la IA (ej., *mid* basado en años de experiencia detectados) como un badge metadata.
  * *Nota funcional:* Se elimina la foto, disponibilidad laboral y modalidad de trabajo para reducir el ruido visual y centrar la interfaz en la validación de competencias técnicas.
  * Acción: "Editar Perfil".
* **Educación:**
  * Grado académico, carrera y universidad del usuario.
  * Acción: "Editar Educación".
* **Habilidades Detectadas (Editable):**
  * Organización por pestañas lógicas: *Técnicas*, *Blandas* y *Herramientas*.
  * Renderizado como chips individuales de las habilidades que **sí posee** el usuario.
  * *Nota funcional:* Se eliminan los tags de brechas en esta sección para evitar redundancias, ya que estas corresponden al panel de Diagnóstico.
  * Acciones: Agregar skill (búsqueda con autocompletado) y eliminar skill (clic en la `x` del chip).
  * **Regla de Reactividad:** Añadir o eliminar habilidades de esta lista recalculará instantáneamente el porcentaje de alineación y el radar del Panel de Diagnóstico.
* **Certificaciones Tecnológicas:**
  * Listado de certificaciones verificadas (AWS, Azure, Scrum, etc.) extraídas. Posicionadas justo debajo de las habilidades como validación de respaldo.
  * Acción: "Editar Certificaciones".
* **Experiencia Laboral (Persistida y Editable - Al final de la columna):**
  * Historial de puestos con empresa, fechas y descripción de funciones. Se ubica al final debido a la longitud de sus textos descriptivos.
  * Acción: "Editar" (abre un formulario rápido para corregir texto).
  * *Nota de alineación:* Las modificaciones en el texto de la experiencia laboral se guardan para la exportación del CV ATS (en el Sidebar), pero no alteran el motor de alineación a menos que el usuario solicite un re-análisis completo del CV.

### 2. Panel de Resultados de Inferencia (Diagnóstico — Columna Derecha / Sticky)

* **Score de Alineación General:**
  * Porcentaje de alineación del usuario con el mercado (ej. 64%).
  * Estado cualitativo: *Alta afinidad*, *Media afinidad*, o *Baja afinidad*.
  * Pequeño indicador comparativo (ej., *"Estás por encima del 68% de los perfiles analizados"*).
* **Especialidad Detectada:**
  * Nombre del cluster principal (ej., *Data Engineering*).
  * Afinidades secundarias listadas como tags de porcentaje (ej., *DevOps 63%*).
* **Afinidad Técnica por Dominio (Gráfico de Radar):**
  * Visualización gráfica comparativa exclusiva en formato **Radar Chart** (se descarta la lista de barras de progreso por redundancia). Muestra la serie de *Demanda del Mercado* vs. *Tu Perfil* en los 5 dominios principales.
* **Fortalezas Detectadas:**
  * Listado de las 5 competencias presentes en el perfil del usuario con mayor demanda en su especialidad.
  * Muestra el nombre, nivel estimado y porcentaje de demanda en ofertas reales.
  * Enlace: "Ver todas las skills (24)" -> Abre el Drawer Lateral de Habilidades para edición completa.
* **Brechas Prioritarias & Insight IA de Alineación:**
  * Listado de las 5 competencias ausentes en el perfil del usuario con mayor criticidad en el mercado.
  * Muestra el nombre, nivel de brecha (Crítica, Alta, Media) y frecuencia de demanda.
  * Justo debajo, se añade el **Insight IA de Alineación** como llamada a la acción (ej. *"Fortalecer habilidades clave como Spark y Hadoop podría aumentar tu alineación con el mercado en +28%"*).
  * Enlace: "Ver todas las brechas (9)" -> Abre el Drawer con el listado completo.
* **Roles Compatibles:**
  * Sección colapsable al final de la columna que muestra los roles del mercado con mayor afinidad actual basados en clustering (ej., *Backend Java Developer - Afinidad Alta*).

---

# Vista 2: Roadmap de Crecimiento & Mercado (`/dashboard/roadmap`)

## Objetivo

Visualizar la ruta de aprendizaje personalizada sugerida para cerrar las brechas de competencias del usuario, respaldando cada recomendación con la analítica de mercado del motor de Machine Learning.

## Componentes

### 1. Ruta Recomendada (Roadmap)
* Estructurada en fases ordenadas secuencialmente (Fase 1, Fase 2, Fase 3) basadas en la dependencia tecnológica y la prioridad del mercado.
* Cada fase contiene tarjetas de competencias a aprender (ej. *Docker*, *AWS*) con un indicador de impacto estimado (ej., *"+8% alineación"*).
* **Insight IA de Mercado (Económico):** Mensajes motivadores intercalados entre las fases del roadmap que muestran los beneficios del mercado laboral real (ej., *"Los perfiles Backend Java con Kubernetes y AWS tienen salarios 32% más altos en el mercado peruano"*).

### 2. Demanda del Cluster (Mercado)
* Tarjeta informativa que detalla la salud y tendencia de la especialidad del usuario (ej., *Crecimiento en ofertas de +28% en los últimos 6 meses* acompañado de un minigráfico sparkline).

### 3. Drawer de Contexto de Mercado (Panel Lateral Reactivo)
* Cuando el usuario hace clic en una competencia del Roadmap o en la lista de brechas, se abre un **Drawer Lateral Derecho (Sheet)** que contiene las justificaciones científicas del motor de clustering y reglas de asociación:
  * **Justificación de FP-Growth (Reglas de Asociación):** Muestra con qué habilidades del usuario se relaciona la brecha (ej. *"Dado que dominas Java y Spring Boot, el mercado requiere Docker con un 74% de confianza"*).
  * **Tendencia Temporal:** Gráfico lineal que muestra el crecimiento de la demanda de esa tecnología en las ofertas de empleo de los últimos meses.
  * **Datos del Cluster (Especialidades):** Detalles del tamaño del cluster objetivo y número de ofertas asociadas.

---

# Vista 3: Vista Pública Compartible (`/public/share/:diagnosticId`)

## Objetivo

Permitir a los usuarios compartir su diagnóstico de alineación verificado en portafolios, hojas de vida digitales y LinkedIn para demostrar su valor técnico en el mercado laboral TI peruano.

## Reglas de Privacidad y Diseño

Para evitar fugas de información sensible y botones huérfanos, la vista pública sigue estas restricciones:

* **Ocultar todo control de edición:** No se muestran botones como "Editar habilidades", "Editar perfil", ni "Editar Educación".
* **Ocultar la Barra Lateral (Sidebar):** No se muestra el Sidebar completo de navegación ni la sección de Documento (evitando la descarga del CV original o actualización del mismo).
* **Ocultar datos sensibles de contacto:** No se expone el correo electrónico, teléfono ni información privada del usuario.
* **Componentes Habilitados:**
  * Nombre del desarrollador y especialidad detectada.
  * Porcentaje de alineación verificado.
  * Gráfico de radar (Afinidad por Dominio).
  * Lista de fortalezas detectadas (skills validadas).
* **Conversión y Branding:**
  * Se añade un sello visual distintivo: **"Alineación Verificada por Devalign"**.
  * Se añade un botón de llamado a la acción (CTA) flotante o al pie de página: **"¿Quieres medir tu alineación con el mercado IT? Analiza tu CV gratis aquí"** que redirige a la landing/registro de Devalign.

---

# Componentes Compartidos

* **Chips de Competencias:**
  * Con estados diferenciados para *Fortaleza* (verde salvia), *Brecha* (amarillo/naranja de advertencia) y *Removido/Filtro*.
* **Indicadores Circulares de Progreso:**
  * Para porcentajes de afinidad y alineación.
* **Componentes de Gráficos (Radar y Líneas):**
  * Adaptables a tema claro y tema oscuro (pizarra).
* **Drawer Lateral Derecho (Sheet):**
  * Utilizado tanto para el detalle analítico de mercado en el Roadmap como para el listado extendido y rápido de edición de habilidades en el Dashboard.
