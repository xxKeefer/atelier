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
- Build on a reka-ui primitive where one exists; let the primitive own the a11y contract.
- Each component ships `.vue` + `.stories.ts` + `.test.ts` and an export from `src/index.ts`.
- Stories carry a `Snapshot` story with a `data-testid="snap-board"` board; the test snaps it via `snapBoard` (baseline in `__snaps__/`, regenerate with `test:update`).

First test run in a session warms the browser and may flake (`Matcher did not succeed in time`, transient render fails). Re-run before treating it as a real failure.
