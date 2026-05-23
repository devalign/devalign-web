# Devalign — Frontend Web (Next.js)

Este es el frontend web de Devalign, desarrollado en **Next.js 16 (App Router)** y estilizado con **Tailwind CSS v4 (CSS-first configuration)**. Utiliza **Supabase** para autenticación y base de datos, y se integra con el backend en FastAPI para el diagnóstico y análisis de perfiles IT.

## Características Clave

1. **Flujo de Autenticación Unificado**:
   - Soporte para Login / Registro / Recuperación de contraseña.
   - Autenticación social con **Google OAuth**.
   - Redirecciones automáticas basadas en el estado de autenticación (Middleware de Supabase).

2. **Zona Protegida y Layout de 3 Columnas**:
   - **Columna 1**: Sidebar colapsable con accesos de navegación, datos del usuario activo y documento cargado actual.
   - **Columna 2**: Contenedor de contenido central (p.ej. subida de CV, diagnóstico).
   - **Columna 3**: Aside contextual dinámico que muestra beneficios, social proof e información de seguridad.
   
3. **Módulo de Perfil y Subida de CV (`/profile`)**:
   - Landing page post-login por defecto.
   - Zona interactiva de **Drag & Drop** con click fallback.
   - Limitación estricta de subida de archivos (máx. 5MB, PDF/DOCX).
   - Pipeline de información que describe de forma interactiva el procesamiento de IA.

4. **Integración con API Backend**:
   - Capa de comunicación centralizada en `src/lib/api/`.
   - Inyección automatizada del token de acceso JWT de Supabase (`Authorization: Bearer <token>`).
   - Hooks de datos reactivos con **React Query** (`useCurrentUser`, `useUploadCV`, `useUserCVs`).
   - Aprovisionamiento JIT (Just-In-Time) de perfiles en PostgreSQL mediante el endpoint `GET /users/me`.

---

## Estructura del Proyecto (`src/`)

```
src/
├── app/
│   ├── (auth)/             # Flujo de login y registro
│   ├── (protected)/        # Zona protegida (requiere autenticación)
│   │   ├── layout.tsx      # Layout de 3 columnas (Sidebar + Main)
│   │   ├── dashboard/      # Vista de diagnóstico debug
│   │   └── profile/        # Vista principal de subida de CV (3 columnas completas)
│   ├── globals.css         # Configuración de variables HSL y Tailwind v4
│   └── layout.tsx          # Root Layout con fuentes y Toaster
├── components/
│   ├── layout/             # Componentes del layout (Sidebar, Context)
│   ├── profile/            # Componentes específicos del Upload de CV
│   ├── ui/                 # Componentes base reutilizables (shadcn/ui)
│   └── providers.tsx       # Inicialización del QueryClient (React Query)
├── hooks/                  # React Query Hooks de comunicación con FastAPI
├── lib/
│   ├── api/                # Cliente HTTP base y servicios API
│   └── supabase/           # Configuración de clientes SSR y Middleware
└── middleware.ts           # Middleware global de Next.js
```

---

## Configuración y Desarrollo

### Requisitos Previos

- Node.js 20+ o 22+
- pnpm instalado (`npm i -g pnpm`)
- Backend corriendo en el puerto 8000 (`http://localhost:8000`)

### Variables de Entorno

Crea o revisa el archivo `.env.local` en la raíz del proyecto. Debe contener:

```env
# Supabase Project Credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key

# Backend API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

### Comandos de Ejecución

Instala las dependencias y corre el servidor local:

```bash
# Instalar dependencias
pnpm install

# Correr servidor de desarrollo
pnpm dev

# Compilar para producción
pnpm build

# Correr análisis de código (Linter)
pnpm run lint
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador para interactuar con la aplicación.
