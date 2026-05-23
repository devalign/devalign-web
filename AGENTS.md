# AI Operational Layer

This repository uses a reusable AI-native operational layer located in `.harness/`.

> `AGENTS.md` is the entrypoint map for agents. Read only what you need, when you need it.

## 1. Before you start

1. Run the `init_harness` workflow to refresh the operational layer and generate project wrappers.
   - If the workflow cannot complete, stop and fix the repository context before touching code.
2. Read `.harness/state/current.md` to understand the last known session state.
3. Read `.harness/state/feature_list.json` to see what is pending, blocked, or active.
4. Read `docs/architecture.md` and `docs/conventions.md` before changing code.
5. If the task is feature-related, read the relevant `specs/` files before implementation.
6. If you need workflow direction, read `.harness/workflows/` and `.harness/evaluations/`.
7. If something is unclear, look in `docs/` before inventing behavior.

## 2. Repository map

| Path                               | What it contains                                             | When to read it                         |
| ---------------------------------- | ------------------------------------------------------------ | --------------------------------------- |
| `.harness/state/current.md`        | Current session state and latest working context             | Always, at the start                    |
| `.harness/state/feature_list.json` | Active feature queue and workflow status                     | Always, at the start                    |
| `.harness/state/history.md`        | Previous session summaries and closures                      | When you need context history           |
| `docs/`                            | Architecture, conventions, and project-specific rules        | Before preparing or implementing work   |
| `specs/`                           | Feature requirements, design, tasks, and acceptance criteria | Before implementing SDD work            |
| `.harness/workflows/`              | Workflow contracts and step-by-step process                  | When deciding the next action           |
| `.harness/evaluations/`            | Readiness and done gates                                     | Before transitions or handoff           |
| `.harness/templates/`              | Reusable templates for the operational layer                 | When generating or refreshing artifacts |

## 3. Development model

This project follows:

- Spec-Driven Development
- Incremental implementation
- Explicit operational state
- Human-supervised AI workflows
- Progressive disclosure instead of reading everything up front

## 4. Hard rules

- Never implement without understanding the spec.
- Never skip acceptance criteria.
- Never mark tasks done without verification.
- Never work on more than one feature at a time.
- Never skip the `docs/` context when the project documents rules there.
- Update operational state files when workflow state changes.
- If you are blocked, document the blockage in `.harness/state/current.md` and stop.

## 5. Session lifecycle (before ending work)

1. Run the `init_harness` workflow and verify the generated wrappers and state are green before closing a session.
2. If the current feature is finished: mark `status: "done"` in `.harness/state/feature_list.json` (follow the finishing checklist in `.harness/evaluations/definition_of_done.md`).
3. Move the summary from `.harness/state/current.md` into `.harness/state/history.md` as an append entry.
4. Reset `.harness/state/current.md` to the session template (leave a placeholder for the next session).
5. Remove temporary files, debug prints, and TODOs without context.

## 6. If you get blocked

- Re-read the relevant section in `docs/` and the handoff that led to your task.
- Document the blocker clearly in `.harness/state/current.md` with steps to reproduce and links to artifacts.
- Do not invent workarounds; pause and request help via the usual handoff or issue channel.

## 5. Workflow map

- `/init_harness` bootstraps the operational layer and refreshes `AGENTS.md`.
- `/prepare_feature` scans the repo, reads `docs/`, and creates the intake handoff.
- `/specify` turns intake into formal specs and acceptance criteria.
- `/implement` turns specs into code and tests.
- `/validate` runs reviewer and QA validation.
- `/continue` recommends the next action from current state.
- `/close_feature` archives the work and finalizes history.

## 6. Source of truth

Project knowledge lives in:

- `docs/`
- `specs/`
- `.harness/`

`AGENTS.md` is created or refreshed by `/init_harness` from `.harness/templates/agents_template.md`.
