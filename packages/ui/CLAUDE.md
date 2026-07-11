# @atelier/ui

The Vue component library. Reka-ui primitives, TypeScript, styled via `@atelier/tokens` through Tailwind v4.

## Component file convention (ADR)

Each component gets its own folder in `src/components/`, named after the component minus its `At` prefix (`Button/`, `Card/`, `Divider/`, `Icon/`, `Input/`; `Elevation/` has no component so keeps its bare name). The folder holds the trio:

- `{Component}.vue` -- the component
- `{Component}.stories.ts` -- the Storybook stories
- `{Component}.test.ts` -- all of its tests, in one file

No `.cursor.test.ts`, `.loading.test.ts`, `.visual.test.ts` splits. One component, one test file. Group concerns with comments inside it, not separate files.

A `.stories.ts` file's shared view fragments (see "Shared render views" below) that would otherwise define more than one Vue component in the file (`vue/one-component-per-file`) move to `{Component}/views/{Name}View.ts`, one `defineComponent` per file, imported back into the stories file. Data a view alone needs moves with it; data shared with the stories file itself (e.g. `argTypes` options) is exported from the view file and re-imported.

### Why

A component's tests are one unit. Splitting by concern fragments the picture, multiplies imports, and makes the trio per component non-obvious. The split also misled on naming: `Button.visual.test.ts` implied a separate test category when it is just Button's test file that happens to do a screenshot.

Per-component folders isolate a component's whole surface -- trio plus any split-out views -- under one directory instead of interleaving files from every component flat in `src/components/`.

### Test mechanics worth knowing

- Vitest runs two browser-mode projects (see `vitest.config.ts`): `storybook` runs every story (play fns -> behaviour, addon-a11y -> axe), `visual` runs `src/**/*.test.ts`.
- A `.test.ts` may pull stories via `composeStories` to reuse their setup (e.g. `Button.test.ts`). That bakes in the preview theme decorator, so assertions and screenshots run through real tokens + fonts.
- `toMatchScreenshot` only exists under Vitest browser mode -- it lives in `.test.ts`, never in story play fns (which also run in Storybook dev).
- Suite-level tests that aren't tied to one component (`src/test/contrast.test.ts`, `src/test/no-scoped-styles.test.ts`) stay standalone -- the trio rule is per component.

Run tests via the flake devShell: `nix develop -c pnpm --filter @atelier/ui test`. Rebaseline screenshots: `pnpm test:update`.

## Visual snapshots (ADR)

One snap per component, of a purpose-built board.

- Every component ships a `Snapshot` story whose template lays out every axis it has -- intents, sizes, variants, states, icon arrangements -- in one labelled grid. The board's root carries `data-testid="snap-board"`. This is the only thing the snapshot test screenshots; the individual stories keep their play-fn / a11y assertions.
- The component's `.test.ts` snaps it in one line: `render(Snapshot); await snapBoard('snap-board', '{component}-snap')`. `snapBoard` (`src/test/snap.ts`) freezes motion, waits for fonts, fits the viewport to the board, and calls `toMatchScreenshot`.
- Baselines live in one flat bucket, `src/components/__snaps__/{name}-{browser}-{platform}.png`, regardless of which component folder the test file lives in. The flat path is hardcoded in `resolveScreenshotPath` in `vitest.config.ts` (default nests per test file's own directory). The `-{browser}-{platform}` suffix is appended by the matcher and can't be removed via its API; we only run nix chromium on linux, so it's constant.

### Mechanics that bite

- Freeze motion before any snap (`snapBoard` does this via `freezeMotion()`, `src/test/freeze-motion.ts`). This vitest's `screenshotOptions` does not expose Playwright's `animations: 'disabled'`, and the matcher's stability retry never settles on an infinite animation (spinner, skeleton pulse) -- it fails as `unstable-screenshot`. The helper injects a stylesheet zeroing animation/transition durations. It's scoped to the snap test, not the shared setup, so it can't alter storybook play-fn timing.
- Screenshot the board element (`data-testid`), never `document.body` or the render container. testing-library doesn't auto-clean between tests here, so body carries leftover DOM from earlier tests; the preview decorator also wraps the story in a `min-h-screen` padded div that adds dead space. The element capture sidesteps both.
- The board must be intrinsic-width (`w-max`), not `w-fit`: `fit-content` is capped by the viewport and clips wide boards.
- `toMatchScreenshot` diffs against the existing baseline file and, on divergence within its tolerance, can silently keep re-passing against a stale image instead of failing loud -- `pnpm test:update` regenerating that same stale baseline (rather than a fresh one) is a symptom. If a component's baseline looks visibly behind its source after several style-only commits, delete the PNG before rerunning `test:update` so it's generated from scratch, not diffed/patched against the old one.
- Sizing: vitest renders tests in a tester iframe and scales it to fit the browser window, so a board taller than the window is captured downscaled. `snapBoard` resizes the viewport to each board (`page.viewport`), and `vitest.config.ts` sets a large context-window viewport (`contextOptions.viewport`) so boards fit under it close to 1:1. Don't screenshot a giant element against a small window -- it either scroll-clips (viewport < board) or downscales (viewport > window).

### Provenance

Browser is pinned by Playwright 1.60.0 -> Chromium 148.0.7778.96 (rev 1223), provisioned via the flake (decisions/0005). Baselines are valid only for that build on linux; a Chromium bump will need `pnpm test:update`.

## Shared render views (ADR)

A `.stories.ts` file's markup lives in one place, not two. Every visual block that appears in both a standalone story and the `Snapshot` board is authored once, as a component, and both call sites render it.

A component with only one such view keeps it inline in the stories file (no `vue/one-component-per-file` warning, since `meta` isn't a component). A component with more than one moves each view to its own file under `{Component}/views/{Name}View.ts`:

```ts
// Button/views/ColorsView.ts -- one component per file, so it never trips
// vue/one-component-per-file even as more views get added alongside it.
import { defineComponent } from 'vue'
import Button from '../AtButton.vue'

export const ColorsView = defineComponent({
  components: { Button },
  setup: () => ({ intents, variants }),
  template: `...`,
})
```

```ts
// Button/AtButton.stories.ts
import { ColorsView } from './views/ColorsView'

export const AllColors: Story = {
  render: () => ({ components: { ColorsView }, template: `<ColorsView />` }),
}

export const Snapshot: Story = {
  render: () => ({
    components: { ColorsView /* , ...other views */ },
    template: `<div data-testid="snap-board"><ColorsView /><!-- ... --></div>`,
  }),
}
```

- Data a view alone needs (arrays of intents/sizes/colourways/etc.) moves into the view file with it. Data the stories file also needs (e.g. `argTypes` options) is exported from the view file and re-imported rather than duplicated.
- A view earns extraction when a story's markup is fully reused verbatim inside the Snapshot board. Don't force it: `Snapshot` boards that combine several stories into one novel layout (e.g. Button's size x variant x state matrix) have nothing to deduplicate against and stay inline.
- Pattern originates in `Elevation.stories.ts` (`NeutralView`, `SemanticsView`, now `Elevation/views/`), and now covers `Button` (`ColorsView`, inline -- only one view), `Card` (`BasicView`, `HeaderAndFooterView`, `FooterSummaryView`, `MediaTopView`, `MediaSideView`, `InteractiveView`, all in `Card/views/`), `Divider` (`HorizontalView`, `VerticalView`, `ColorsView`, in `Divider/views/`), `Icon` (`SizesView`, `WeightsView`, `ColorsView`, `SemanticView`, in `Icon/views/`), and `Input` (`SizesView`, inline -- only one view).
- Registering the real `Button`/`Input` component inside a `defineComponent`'s `components` option trips `vue/no-reserved-component-names` (it only fires on `defineComponent`-wrapped definitions, not the bare object literals other `render()` functions return) -- silence it inline with `// eslint-disable-next-line vue/no-reserved-component-names`, since the name being registered is the imported component, not a new one being defined.
