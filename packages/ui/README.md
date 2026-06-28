# @atelier/ui

The Atelier Vue 3 component library. Built on [reka-ui](https://reka-ui.com) primitives, styled via [`@atelier/tokens`](../tokens) through Tailwind v4.

```sh
pnpm build        # build lib + types
pnpm dev          # watch
pnpm test         # vitest (behavior + a11y + visual snapshots)
pnpm test:update  # rebaseline visual snapshots after an intended UI change
pnpm typecheck    # vue-tsc
pnpm storybook    # component workshop on :6006
```

`pnpm test` runs Storybook stories as browser-mode Vitest tests (play fns -> behavior,
addon-a11y -> axe) plus `*.test.ts` visual snapshots (`toMatchScreenshot`, pixelmatch).
It launches a Playwright chromium, so it **must run inside the Nix dev shell**:

```sh
cd <repo root> && nix develop --command pnpm --filter @atelier/ui test
```

Only the test run needs Nix; `build`, `typecheck`, and `storybook` run plain. Visual
baselines live in `src/components/__screenshots__/` and are pinned to the Nix-built
chromium (revision 1223) -- they will thrash on a different machine or CI. See
`decisions/0005-testing-and-visual-snapshot-strategy.md`.

Consumers import the components and the stylesheet:

```ts
import '@atelier/ui/style.css'
```

No components yet -- scaffold only.
