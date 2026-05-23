---
version: alpha
name: Devalign Design System
description: Sistema de diseño unificado y premium basado en tonos verdes salvia y pizarra forestal, diseñado para inspirar confianza y alineación técnica.

colors:
  primary: '#8EAD9A' # Verde Salvia (Base de alineación)
  primary-foreground: '#1D3224' # Verde Pizarra Forestal Oscuro
  background: '#F4F6F4' # Blanco Salvia Suave
  foreground: '#1D3224' # Verde Pizarra Forestal Oscuro
  card: '#FFFFFF' # Blanco Puro
  card-foreground: '#1D3224'
  popover: '#FFFFFF'
  popover-foreground: '#1D3224'
  secondary: '#EDF0ED' # Gris Salvia Muy Claro
  secondary-foreground: '#1D3224'
  muted: '#EDF0ED'
  muted-foreground: '#67756B' # Muted text con tinte salvia
  accent: '#8EAD9A'
  accent-foreground: '#1D3224'
  border: '#DCE3DE' # Gris Salvia Claro
  input: '#DCE3DE'
  ring: '#8EAD9A'
  destructive: '#EF4444'
  destructive-foreground: '#F9FAFB'
  success: '#10B981'
  success-foreground: '#FFFFFF'

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
- **Premium**: Acabado contemporáneo usando fondos sutiles con sombras suaves (`shadow-black/5`) y difuminado de fondo (`backdrop-blur-xl`).

---

## Usage Guidelines

### Colors

- **Primary (`#8EAD9A`)**: Usado para botones principales, llamadas a la acción relevantes, indicadores de progreso completado y acentos visuales dominantes. Su texto en contraste siempre debe ser **Forest Green (`#1D3224`)** para cumplir con las guías WCAG.
- **Background (`#F4F6F4`)**: Fondo general de la plataforma que atenúa la dureza de los blancos puros en pantallas.
- **Foreground / Slate (`#1D3224`)**: Texto principal, títulos de tarjetas y elementos interactivos oscuros.
- **Borders (`#DCE3DE`)**: Líneas divisorias delgadas y bordes de inputs para una delimitación limpia sin saturación.

### Typography

- El texto de UI general debe usar la clase `font-sans`.
- Cualquier cadena de código, identificadores UUID (como el id de Supabase), valores JSON y estados del sistema deben usar `font-mono`.

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
  - La landing page post-login por defecto es `/profile` ([page.tsx](file:///c:/Projects/Devalign/devalign-web/src/app/(protected)/profile/page.tsx)), que contiene el flujo de upload del CV para análisis inicial del desarrollador.

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
2.  **Card**: Componente estructurado en subcomponentes (`CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`) para enmarcar secciones de contenido. Incorpora sombras sutiles (`shadow-lg shadow-black/5`) y bordes claros (`border-border`).
3.  **Input**: Elemento de entrada de texto optimizado para formularios. Cuenta con estados deshabilitados con opacidad controlada y efectos de anillo (`focus-visible:ring-1`) al enfocarse.
4.  **Form**: Componentes de formulario basados en `react-hook-form` y `zod` para validaciones completas en el cliente.
5.  **Tabs**: Soporte para vistas tabulares dinámicas (utilizado para alternar entre Login y Signup).

---

## Backend Integration & Security

La interfaz se comunica con el backend FastAPI (puerto 8000) mediante peticiones HTTP autenticadas utilizando un token JWT de Supabase:

1.  Al cargar el `/dashboard`, el servidor de Next.js solicita el token de acceso activo desde Supabase.
2.  Realiza una llamada HTTP al backend `GET ${API_BASE_URL}/users/me` enviando el token en la cabecera `Authorization: Bearer <token>`.
3.  El backend de FastAPI valida la firma del token y aprovisiona al usuario en PostgreSQL bajo demanda (JIT - Just In Time) si es la primera vez que inicia sesión.
4.  El dashboard muestra el estado del aprovisionamiento de forma visual al usuario, garantizando sincronización total entre la autenticación y la base de datos local.

---

## Future Styling Roadmap

- **Modo Oscuro Dinámico**: Al agregar componentes nuevos, utilizar variables semánticas (p.ej., `bg-card`, `text-muted-foreground`) para asegurar que el cambio entre el tema claro y el tema oscuro pizarra (`.dark` en [globals.css](file:///c:/Projects/Devalign/devalign-web/src/app/globals.css)) sea transparente.
- **Soporte de CLI**: El archivo `DESIGN.md` es compatible con el validador oficial `npx @google/design.md lint DESIGN.md` para garantizar el cumplimiento de accesibilidad y estructura de tokens.
