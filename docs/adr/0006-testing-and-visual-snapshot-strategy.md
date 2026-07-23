# ADR-0006: Testing and visual-snapshot strategy

- Status: accepted
- Date: 2026-06-21

## Context

`@atelier/ui` needs behavior, accessibility, and visual-regression testing,
all free and fully local -- no Chromatic, no hosted/paid service, no CI
requirement. Solo project on one NixOS box.

## Decision

**One runner: Storybook stories as Vitest browser tests.** Stories are the
single source -- each story definition feeds both the behavior/a11y test and
the visual snapshot.

- **Storybook 9** (`@storybook/vue3-vite`). `.storybook/preview.ts` imports
  `styles.css` so every story renders through the real theme + fonts.
- **`@storybook/addon-vitest`** runs stories as tests in Vitest **browser
  mode** (Playwright chromium). Story `play` functions become behavior
  assertions.
- **`@storybook/addon-a11y`** runs axe inside the same Vitest pass.
  `parameters.a11y.test = 'error'` fails the run on any violation.
- `packages/ui/vitest.config.ts` runs **two `test.projects`**: `storybook`
  (the `storybookTest` plugin, restricted to story files) and `visual`
  (plain `src/**/*.test.ts` -- needs its own project since `storybookTest`
  won't pick up non-story files).
- `.storybook/vitest.setup.ts` calls `setProjectAnnotations([preview])` so
  the theme decorator and a11y params apply under test.

Run: `nix develop -c pnpm --filter @atelier/ui test` -- must be inside the
Nix dev shell (see below).

**Visual snapshots** use Vitest 4's browser-only `toMatchScreenshot`
matcher, which forced a bump from Vitest 3.2 to 4.1.9. Lives in the
`visual` project (`.test.ts`), never in story `play` fns, since it only
exists under browser mode. `vitest` / `@vitest/browser` pinned `^4.1.9`;
`@vitest/browser-playwright` (the provider moved to its own package in v4)
added alongside. Comparator: pixelmatch, `allowedMismatchedPixelRatio: 0.01`.
See `packages/ui/CLAUDE.md` for the current one-snap-per-component
(`snap-board`) convention this evolved into.

**Baselines** are committed in-repo at
`packages/ui/src/components/__screenshots__/`. First run with no reference
writes it and fails by design; re-run passes. Rebaseline after an intended
change: `pnpm test:update` (`vitest run -u`). Diff/actual byproducts land in
`.vitest-attachments/` (gitignored).

**Pixel baselines are OS/font-render specific** -- viable only because this
is solo on one Nix box with no CI. The Nix-pinned chromium gives
deterministic rendering as long as the pin holds.

Fallback considered and not needed: `@storybook/test-runner` +
`jest-image-snapshot` -- a separate Playwright/Jest system that can't diff
inside browser mode. The Vitest 4 matcher keeps behavior + a11y + visual on
one runner.

## NixOS Playwright provisioning

Playwright's own browser downloads are dynamically linked and don't run on
NixOS unpatched. `flake.nix`'s devShell supplies Nix-built browsers
(`pkgs.playwright-driver.browsers`) and exports `PLAYWRIGHT_BROWSERS_PATH`,
`PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=true`, `PLAYWRIGHT_NODEJS_PATH`.

**Hard constraint:** the npm `playwright` version must match
`playwright-driver.version` or the browser revision won't resolve. Currently
pinned at **playwright 1.60.0** (chromium rev 1223) to match the flake's
`nixpkgs`-resolved driver. Bump both together: `nix flake update`, read the
`playwright-driver 1.x.y -> ...` line the shellHook prints, set the npm pin
to match. Install with `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1` so npm doesn't
fetch its own. `flake.nix` must be `git add`ed before `nix develop` sees it
(flakes ignore untracked files).

## Consequences

- Any Vitest/Storybook/Playwright version bump must keep `playwright`,
  `@storybook/addon-vitest`'s peer range, and the Nix driver version in
  lockstep, or the browser fails to launch.
- No CI gate exists yet -- baselines will need regeneration the moment a
  second machine or real CI runs this suite.
