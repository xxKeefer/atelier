# Atelier

Personal design system + Vue component library. pnpm monorepo: `@atelier/tokens` (spine), `@atelier/ui` (components), docs.

## Run everything through the Nix dev shell

This is a NixOS host. The npm `playwright` browser binaries are dynamically linked against libs NixOS does not have (`libglib-2.0.so.0` etc.) and will NOT launch directly -- the vitest browser-mode suite dies with `error while loading shared libraries`.

The flake's devShell exports `PLAYWRIGHT_BROWSERS_PATH` to a Nix-built browser plus the matching env. You MUST be inside it for any test, lint, build, or typecheck.

- `.envrc` is `use flake` -- in an interactive shell direnv loads it automatically.
- A non-direnv shell (agents, raw scripts) does NOT get it. Prefix every command:

```
nix develop -c pnpm --filter @atelier/ui test
nix develop -c pnpm --filter @atelier/ui exec vitest run AtDivider   # single file
nix develop -c pnpm --filter @atelier/ui test:update                 # rebaseline snapshots
nix develop -c pnpm lint
nix develop -c pnpm --filter @atelier/ui typecheck
```

Never run `pnpm test` bare -- it will fail on the browser launch, not on your code.

## Components

Pattern is fixed -- mirror `packages/ui/src/components/AtIcon.vue` and `AtButton.vue`:

- `<script setup lang="ts">` + `withDefaults(defineProps<...>(), ...)`.
- NO `<style>` block. Tailwind classes only (enforced by `src/test/no-scoped-styles.test.ts`). Style via token CSS vars (`var(--color-...)`).
- NEVER consume a raw palette var in a class -- `border-[var(--palette-green-800)]`, `bg-[var(--palette-magenta-600)]` and the like are banned. The palette layer is private to the token definitions; components and stories consume only semantic/component tokens (`--color-*`, `--shadow-*`, `--spacing-*`). A reach for `--palette-*` means the token you need does not exist yet -- add the semantic token in `@atelier/tokens`, then consume that. The same goes for hand-rolled arbitrary values that encode a design decision (`shadow-[0_6px_0_0_...]`, `duration-[120ms]`): if it carries meaning, it wants a token.
- Build on a reka-ui primitive where one exists; let the primitive own the a11y contract.
- Each component ships `.vue` + `.stories.ts` + `.test.ts` and an export from `src/index.ts`.
- Stories carry a `Snapshot` story with a `data-testid="snap-board"` board; the test snaps it via `snapBoard` (baseline in `__snaps__/`, regenerate with `test:update`).

First test run in a session warms the browser and may flake (`Matcher did not succeed in time`, transient render fails). Re-run before treating it as a real failure.

## Agent skills

### Issue tracker

Issues live as cards on the Obsidian Kanban board at `05-projects/atelier/atelier.kanban.md` in the user's vault (solo project, no PR-as-request-surface). See `docs/agents/issue-tracker.md`.

### Triage labels

Not wired up -- this is a solo project board with no external reporters, so the 5-state triage model doesn't apply. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context -- one `CONTEXT.md` + `docs/adr/` at the repo root (neither exists yet; created lazily by domain-modeling skills). See `docs/agents/domain.md`.
