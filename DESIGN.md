---
version: alpha
name: Devalign Design System
description: Sistema de diseño unificado y premium basado en tonos verdes salvia y pizarra forestal, diseñado para inspirar confianza y alineación técnica.

colors:
  primary: '#8EAD9A' # Verde Salvia (Base de alineación)
  primary-foreground: '#1D3224' # Verde Pizarra Forestal Oscuro
  background: '#F5F7F5' # Blanco Salvia Suave (Light HSL 140 12% 97%)
  foreground: '#1D3224' # Verde Pizarra Forestal Oscuro
  card: '#FFFFFF' # Blanco Puro
  card-foreground: '#1D3224'
  popover: '#FFFFFF'
  popover-foreground: '#1D3224'
  secondary: '#E4E9F0' # Azul Pizarra Suave (Light HSL 215 30% 92%)
  secondary-foreground: '#212C3B' # Deep blue-slate (Light HSL 215 35% 20%)
  muted: '#E9ECE9' # Gris Salvia Sutil (Light HSL 140 12% 93%)
  muted-foreground: '#677F6E' # Muted text con tinte salvia (Light HSL 143 10% 45%)
  accent: '#8EAD9A'
  accent-foreground: '#1D3224'
  border: '#DAE1DA' # Gris Salvia Claro (Light HSL 140 12% 86%)
  input: '#DAE1DA'
  ring: '#8EAD9A'
  destructive: '#EF4444'
  destructive-foreground: '#F9FAFB'
  success: '#16A34A'
  success-foreground: '#FFF2F3'

typography:
  font-sans:
    fontFamily: 'Inter, ui-sans-serif, system-ui'
    description: 'Fuente principal para legibilidad de interfaces e información'
  font-mono:
    fontFamily: 'JetBrains Mono, ui-monospace, SFMono-Regular'
    description: 'Fuente para código, IDs de sesión y métricas de diagnóstico'

spacing:
  radius-base: '0.75rem' # 12px
  radius-md: '0.625rem' # 10px
  radius-sm: '0.5rem' # 8px

components:
  auth-banner:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.primary-foreground}'
  auth-shell:
    backgroundColor: '{colors.background}'
    gridBorderColor: '{colors.border}'
  auth-card:
    backgroundColor: '{colors.card}'
    borderColor: '{colors.border}'
    textColor: '{colors.foreground}'
  dashboard-layout:
    backgroundColor: '{colors.background}'
    headerBackgroundColor: '{colors.card}'
    headerBorderColor: '{colors.border}'
---

# Design Rationale

## Atmosphere

La atmósfera visual de Devalign debe evocar profesionalismo, mentoría técnica y precisión. Nos alejamos de los azules genéricos tradicionales del sector TI y optamos por una paleta centralizada en el color verde salvia **#8EAD9A** (`hsl(143 16% 62%)`) complementada con pizarra forestal oscuro **#1D3224** (`hsl(143 27% 15%)`). Esta combinación transmite:

- **Seguridad**: Colores orgánicos que reducen la tensión y la fatiga visual.
- **Precisión**: Alta legibilidad y contraste adecuado para herramientas de diagnóstico.
- **Premium**: Acabado contemporáneo y plano, usando fondos sutiles con bordes de contorno limpios y difuminado de fondo (`backdrop-blur-xl`).

---

## Usage Guidelines

### Colors

- **Primary (`#8EAD9A`)**: Usado para botones principales, llamadas a la acción relevantes, indicadores de progreso completado y acentos visuales dominantes. Su texto en contraste siempre debe ser **Forest Green (`#1D3224`)** para cumplir con las guías WCAG.
- **Background (`#F5F7F5`)**: Fondo general de la plataforma en Light Mode, que atenúa la dureza de los blancos puros en pantallas.
- **Foreground / Slate (`#1D3224`)**: Texto principal, títulos de tarjetas y elementos interactivos oscuros en Light Mode.
- **Borders (`#DAE1DA`)**: Líneas divisorias delgadas y bordes de inputs para una delimitación limpia sin saturación.

### Typography

- El texto de UI general debe usar la clase `font-sans`.
- Cualquier cadena de código, identificadores UUID (como el id de Supabase), valores JSON y estados del sistema deben usar `font-mono`.

---

## TailwindCSS v4 & CSS-First Styling

Devalign utiliza **TailwindCSS v4** bajo un modelo de configuración CSS-First declarado en [globals.css](file:///c:/Projects/Devalign/devalign-web/src/app/globals.css). Toda la configuración del tema y variantes se administra mediante directivas CSS estándar dentro del bloque `@theme`.

### Tema de HSL Tokens (Light vs. Dark Mode)

| Token Variable | Light Mode (HSL / Hex) | Dark Mode (HSL / Hex) | Descripción / Propósito |
| :--- | :--- | :--- | :--- |
| `--background` | `140 12% 97%` / `#F5F7F5` | `143 20% 6%` / `#0C130E` | Fondo general de la interfaz |
| `--foreground` | `143 27% 15%` / `#1D3224` | `140 12% 93%` / `#E9ECE9` | Texto principal del sistema |
| `--primary` | `143 16% 62%` / `#8EAD9A` | `143 16% 62%` / `#8EAD9A` | Color primario de marca (Verde Salvia) |
| `--primary-foreground` | `143 27% 15%` / `#1D3224` | `143 27% 15%` / `#1D3224` | Texto en contraste sobre fondo primario |
| `--secondary` | `215 30% 92%` / `#E4E9F0` | `215 25% 14%` / `#1B2430` | Color secundario (Azul Pizarra) |
| `--secondary-foreground`| `215 35% 20%` / `#212C3B` | `215 30% 92%` / `#E4E9F0` | Texto sobre fondo secundario |
| `--muted` | `140 12% 93%` / `#E9ECE9` | `143 15% 14%` / `#1B241D` | Color atenuado para fondos secundarios |
| `--muted-foreground` | `143 10% 45%` / `#677F6E` | `143 8% 65%` / `#9EACA1` | Texto secundario y etiquetas |
| `--card` | `0 0% 100%` / `#FFFFFF` | `143 18% 10%` / `#151E18` | Fondo de contenedores y tarjetas |
| `--card-foreground` | `143 27% 15%` / `#1D3224` | `140 12% 93%` / `#E9ECE9` | Texto sobre tarjetas |
| `--border` / `--input` | `140 12% 86%` / `#DAE1DA` | `143 15% 14%` / `#1B241D` | Bordes generales e inputs |
| `--ring` | `143 16% 62%` / `#8EAD9A` | `143 16% 62%` / `#8EAD9A` | Anillos de foco y selección |
| `--destructive` | `0 84.2% 60.2%` / `#EF4444` | `0 62.8% 30.6%` / `#7F1D1D` | Elementos de error o peligro |
| `--success` | `142.1 76.2% 36.3%`/`#16A34A` | `142.1 70% 45%` / `#22C55E` | Indicadores de completado o éxito |

### Sidebar Tokens

La barra lateral tiene tokens de tema exclusivos para controlar su visualización:

| Variable de Sidebar | Light Mode HSL | Dark Mode HSL |
| :--- | :--- | :--- |
| `--sidebar-background` | `0 0% 100%` | `143 18% 10%` |
| `--sidebar-foreground` | `143 27% 15%` | `140 12% 93%` |
| `--sidebar-primary` | `143 27% 15%` | `143 16% 62%` |
| `--sidebar-primary-foreground`| `140 12% 97%` | `143 27% 15%` |
| `--sidebar-accent` | `140 12% 93%` | `143 15% 14%` |
| `--sidebar-accent-foreground` | `143 27% 15%` | `140 12% 93%` |
| `--sidebar-border` | `140 12% 86%` | `143 15% 14%` |
| `--sidebar-ring` | `143 16% 62%` | `143 16% 62%` |

### Arquitectura de Configuración y Variantes
- **Variante de Modo Oscuro**: Declarado con `@custom-variant dark (&:where(.dark, .dark *));`. Esto activa el modo oscuro agregando la clase `.dark` al contenedor principal (generalmente `<html>` o `<body>`).
- **Nombres de Clases y Variables**: En Tailwind v4, registrar variables en `@theme` como `--color-primary` genera de manera automática clases utilitarias como `bg-primary`, `text-primary` y `border-primary`.

---

## Architecture & Layouts

El enrutamiento y la estructura general siguen la arquitectura de **Next.js 16 (App Router)** utilizando Route Groups para separar layouts y comportamientos de manera lógica:

### 3.1. Grupos de Rutas y Páginas

- **Flujo de Autenticación (`/` o ruta de login)**:
  - Implementado a través de [page.tsx](file:///c:/Projects/Devalign/devalign-web/src/app/page.tsx) que renderiza el [AuthShell](file:///c:/Projects/Devalign/devalign-web/src/components/auth/auth-shell.tsx) envolviendo al [AuthCard](<file:///c:/Projects/Devalign/devalign-web/src/app/(auth)/login/auth-card.tsx>).
  - Ofrece un diseño tipo "banner publicitario + formulario centrado" con un efecto visual de fondo que simula una grilla circular tecnológica de color `{colors.border}`.
- **Zona Protegida (`(protected)`)**:
  - Implementa un sistema de layouts de 3 columnas compuesto por:
    - **Columna 1: Sidebar de Navegación** ([app-sidebar.tsx](file:///c:/Projects/Devalign/devalign-web/src/components/layout/app-sidebar.tsx)): Menú colapsable lateral con información del usuario autenticado, estado activo/bloqueado de vistas y botón de cierre de sesión.
    - **Columna 2: Contenido Principal**: El espacio flexible central (`{children}`) que renderiza páginas específicas (como `/profile` o `/dashboard`).
    - **Columna 3: Aside Contextual** (p.ej. [profile-aside.tsx](file:///c:/Projects/Devalign/devalign-web/src/components/profile/profile-aside.tsx)): Barra lateral derecha para mostrar beneficios, social proof, guías informativas y políticas de seguridad ajustadas al contexto activo.
  - La landing page post-login por defecto es `/profile` ([page.tsx](<file:///c:/Projects/Devalign/devalign-web/src/app/(protected)/profile/page.tsx>)), que contiene el flujo de upload del CV para análisis inicial del desarrollador.
  - **Diagnóstico Inteligente (`/diagnosis`)**:
    - Implementado a través de [page.tsx](<file:///c:/Projects/Devalign/devalign-web/src/app/(protected)/diagnosis/page.tsx>) que renderiza el [DiagnosisDashboard](file:///c:/Projects/Devalign/devalign-web/src/components/diagnosis/diagnosis-dashboard.tsx).
    - Orquesta un bento-grid responsivo de 3 columnas en desktop para mostrar las fortalezas, brechas, afinidad por dominio, roles compatibles, insights y tendencias del mercado.
    - Utiliza `recharts` para las visualizaciones de datos, estilizadas de forma dinámica usando las variables HSL de los temas del sistema de diseño.

### 3.2. Middleware y Protección de Rutas

- [middleware.ts](file:///c:/Projects/Devalign/devalign-web/src/middleware.ts) intercepta las peticiones de páginas.
- Delega a [src/lib/supabase/middleware.ts](file:///c:/Projects/Devalign/devalign-web/src/lib/supabase/middleware.ts), el cual:
  1.  Obtiene la sesión del usuario de forma asíncrona mediante cookies.
  2.  Si el usuario no está autenticado e intenta acceder a rutas de la zona protegida (`/dashboard`, `/profile`, `/analysis`, `/roadmap`), lo redirige al flujo de login.
  3.  Si el usuario está autenticado e intenta entrar a las rutas de auth (`/login`, `/register`), lo redirige directamente al `/dashboard`.

---

## Component Guide

Los componentes de interfaz se localizan en [src/components/ui](file:///c:/Projects/Devalign/devalign-web/src/components/ui). Todos ellos siguen el patrón de extender los elementos HTML estándar de React y aplicar estilos Tailwind mediante la utilidad `cn(...)` de [src/lib/utils.ts](file:///c:/Projects/Devalign/devalign-web/src/lib/utils.ts) para permitir personalizaciones locales sin perder los estilos base:

1.  **Button**: Ofrece variantes estilizadas (`default`, `destructive`, `outline`, `secondary`, `ghost`, `link`) y tamaños preconfigurados. Utiliza transiciones de color suaves ante eventos hover.
2.  **Card**: Componente estructurado en subcomponentes (`CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`) para enmarcar secciones de contenido.
3.  **Input**: Elemento de entrada de texto optimizado para formularios. Cuenta con estados deshabilitados con opacidad controlada y efectos de anillo (`focus-visible:ring-1`) al enfocarse.
4.  **Form**: Componentes de formulario basados en `react-hook-form` y `zod` para validaciones completas en el cliente.
5.  **Tabs**: Soporte para vistas tabulares dinámicas (utilizado para alternar entre Login y Signup).
6.  **Diagnosis Components**: Tarjetas del panel de diagnóstico (`StrengthsCard`, `PriorityGapsCard`, `AffinityRadarChartCard`, etc.) que siguen las pautas de diseño atómico del perfil (utilizando `Card` con bordes planos y cajas de habilidades redondeadas) y exponen gráficos interactivos con `recharts` controlados por temas.

### Tailwind Custom Utilities

El sistema expone utilidades de diseño para contenedores y tarjetas declaradas en [globals.css](file:///c:/Projects/Devalign/devalign-web/src/app/globals.css) usando `@utility`:

- `@utility card-standard`: Aplica fondo `--color-card`, borde `--color-border` y redondeado de `12px` (`rounded-xl`).
- `@utility card-elevated`: Añade espaciado interno de `1.5rem` (`p-6`) sobre la estructura estándar.
- `@utility card-tinted`: Usa una base del color primario con `5%` de opacidad (`bg-primary/5`) y un borde del primario al `20%` (`border-primary/20`) para destacar áreas de contenido especial.
- `@utility card-glass`: Aplica un fondo traslúcido (`bg-background/60`), desenfoque de fondo (`backdrop-blur-md`), borde y redondeado premium (`rounded-2xl`).

### Animaciones e Interacción
- **Animaciones de Acordeón**: Se configuran variables de animación `--animate-accordion-down` y `--animate-accordion-up` con transiciones de `0.2s` y funciones de aceleración cúbicas.
- **Scrollbar Premium**: Barras de desplazamiento personalizadas de `6px` de grosor, con bordes redondeados y un efecto hover que resalta en el color primario con `60%` de opacidad (`hsl(var(--primary) / 0.6)`).

---

## Backend Integration & Security

La interfaz se comunica con el backend FastAPI (puerto 8000) mediante peticiones HTTP autenticadas utilizando un token JWT de Supabase:

1.  Al cargar el `/dashboard`, el servidor de Next.js solicita el token de acceso activo desde Supabase.
2.  Realiza una llamada HTTP al backend `GET ${API_BASE_URL}/users/me` enviando el token en la cabecera `Authorization: Bearer <token>`.
3.  El backend de FastAPI valida la firma del token y aprovisiona al usuario en PostgreSQL bajo demanda (JIT - Just In Time) si es la primera vez que inicia sesión.
4.  El dashboard muestra el estado del aprovisionamiento de forma visual al usuario, garantizando sincronización total entre la autenticación y la base de datos local.

---

## Future Styling Roadmap

- **Modo Oscuro Dinámico**: Al agregar componentes nuevos, utilizar variables semánticas (p.ej., `bg-card`, `text-muted-foreground`) para asegurar que el cambio entre el tema claro y el tema oscuro sea transparente.
- **Soporte de CLI**: El archivo `DESIGN.md` es compatible con el validador oficial `npx @google/design.md lint DESIGN.md` para garantizar el cumplimiento de accesibilidad y estructura de tokens.
