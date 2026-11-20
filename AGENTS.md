# devalign-web — Agent Rules

Frontend web application for Devalign (Spanish-facing developer experience).

## Stack & Package Manager

- **Framework:** Next.js `16.2.6` (App Router), React `19.2.4`, TypeScript `5`.
- **Styling & UI:** Tailwind CSS `v4`, Radix UI, Lucide icons, Framer Motion, Recharts, `react-force-graph-2d` / `3d`.
- **State & Forms:** TanStack React Query, Zustand, React Hook Form + Zod v4, Supabase SSR.
- **Package Manager:** **strictly `pnpm`** (never use `npm` or `yarn`).

## Language & Styling Rules (Aligned with `.agents/rules/alcance.md`)

- **Codebase in English:** All component names, hooks, functions, types, variables, comments, and commit messages must be in English.
- **UI Strictly in Spanish:** All user-facing titles, labels, buttons, placeholders, validation messages, helper text, and toasts must be in Spanish.
- **Tailwind CSS v4 Only:** Configure theme tokens inside `src/app/globals.css` under `@theme`. Do not create or edit `tailwind.config.js`.
- **No Arbitrary Hex Colors:** Never use arbitrary color classes (e.g., `text-[#3B82F6]`); always use semantic tokens (`text-primary`, `bg-secondary`, `text-muted-foreground`).

## Quality Gates

Run inside `c:\Projects\Devalign\devalign-web`:

- Lint: `pnpm lint`
- Format check: `pnpm format:check`
- Type check: `pnpm exec tsc --noEmit`
- Production build: `pnpm build`

## Safety

- Never overwrite `.env.local`; update `.env.example` for new client/public environment variables.
