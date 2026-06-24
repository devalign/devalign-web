# Devalign — Frontend Web (Next.js)

Este es el frontend web de Devalign, desarrollado en **Next.js 16 (App Router)** y estilizado con **Tailwind CSS v4 (CSS-first configuration)**. Utiliza **Supabase SSR** para autenticación y persistencia de sesión, y se integra con la API del backend de FastAPI para el perfilamiento y diagnóstico de desarrolladores.

---

## 🚀 Características Clave

1. **Flujo de Autenticación Unificado**:
   - Autenticación clásica y login social con **Google OAuth**.
   - Redirecciones automáticas basadas en cookies mediante el **Middleware SSR de Supabase**.
2. **Layout de 3 Columnas Protegido**:
   - **Columna 1 (Sidebar)**: Panel de control lateral colapsable con accesos rápidos y estado del documento procesado.
   - **Columna 2 (Contenedor Central)**: Vistas principales, incluyendo subida de CV (Drag & Drop) y visualización del diagnóstico.
   - **Columna 3 (Aside Contextual)**: Información de seguridad y detalles del mercado IT.
3. **Subida de CV e Inferencia**:
   - Zona de subida Drag & Drop interactiva (máx. 5MB, PDF/DOCX).
   - Pantalla interactiva que informa en tiempo real del progreso de extracción e inferencia de habilidades en el backend.
4. **Integración con la API Backend (FastAPI)**:
   - Capa de servicios centralizada en `src/lib/api/` con interceptor JWT de Supabase.
   - Manejo de estado y sincronización reactiva utilizando **React Query**.
   - Aprovisionamiento JIT (Just-In-Time) de perfiles mediante `GET /users/me`.

---

## 📁 Estructura del Proyecto (`src/`)

```
src/
├── app/
│   ├── (auth)/             # Login, registro y restablecimiento de contraseña
│   ├── (protected)/        # Rutas protegidas (Sidebar + Workspace + Aside)
│   │   ├── profile/        # Vista principal del perfil y carga de CV
│   │   └── dashboard/      # Panel de visualización de diagnósticos
│   ├── globals.css         # Configuración del sistema de diseño (variables HSL y Tailwind v4)
│   └── layout.tsx          # Root Layout con fuentes y proveedores globales
├── components/
│   ├── layout/             # Componentes del layout (Sidebar, ContextAside)
│   ├── ui/                 # Componentes base e interactivos reutilizables (shadcn/ui)
│   └── profile/            # Componentes específicos de la subida y análisis de CV
├── hooks/                  # React Query Hooks de comunicación con FastAPI
├── lib/
│   ├── api/                # Cliente HTTP base y servicios de API
│   └── supabase/           # Configuración de clientes SSR y Middleware
└── middleware.ts           # Middleware global de Next.js para rutas seguras
```

---

## ⚙️ Configuración y Desarrollo

### Requisitos Previos

- Node.js 20+ o 22+
- **pnpm** instalado (`npm i -g pnpm`) (Nota: No utilice `npm` ni `package-lock.json` en este repositorio).

### Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto basándote en `.env.example`:

```env
# Supabase Project Credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key

# Backend API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

### Comandos de Ejecución

```bash
# Instalar dependencias con pnpm
pnpm install

# Correr servidor de desarrollo
pnpm dev

# Compilar para producción
pnpm build

# Validar linting y calidad de código
pnpm run lint
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador para interactuar con la aplicación.

---

## 🔗 Referencias a la Documentación Principal

El diseño del sistema, los contratos de endpoints con la API y el modelo del negocio están documentados en el repositorio de documentación central:

- [🏗️ Arquitectura Técnica](../devalign-docs/ARCHITECTURE.md)
- [🤝 Contratos de Interfaz](../devalign-docs/CONTRACTS.md)
- [🗄️ Modelo de Base de Datos](../devalign-docs/DATABASE.md)
- [🧠 Lógica Core e Inferencia](../devalign-docs/MODEL.md)
- [🗺️ Roadmap de Producto](../devalign-docs/ROADMAP.md)
- [🎯 Alcance MVP](../devalign-docs/SCOPE.md)
- [📄 Documento de Requerimientos de Producto (PRD)](../devalign-docs/PRD.md)
- [📋 Product Backlog](../devalign-docs/PRODUCT_BACKLOG.md)
- [🏃 Sprint Backlog](../devalign-docs/SPRINT_BACKLOG.md)
