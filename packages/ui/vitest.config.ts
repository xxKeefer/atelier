import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'

const dirname = fileURLToPath(new URL('.', import.meta.url))
const setup = `${dirname}.storybook/vitest.setup.ts`

// Nix-provided Playwright chromium for every project. See flake.nix /
// decisions/0005 for the NixOS browser provisioning. A factory so each project
// gets its own provider + instances (shared references collide on project names).
const browser = () => ({
  enabled: true,
  headless: true,
  // A large browser-context window. vitest scales the tester iframe down to fit
  // its window, so a per-board viewport taller than the window gets captured
  // downscaled (and inconsistently, since each board sizes its own viewport).
  // Sizing the window past the tallest board keeps every snapBoard() capture 1:1.
  provider: playwright({ contextOptions: { viewport: { width: 2000, height: 3200 } } }),
  // No auto-screenshot on failure: the contrast test isn't visual, and the
  // visual test owns its own baselines via toMatchScreenshot.
  screenshotFailures: false,
  instances: [{ browser: 'chromium' as const }],
  // Collapse the default per-test-file nesting into one flat bucket, regardless
  // of which component folder the test file lives in:
  // src/components/__snaps__/{arg}-{browser}-{platform}.png. The browser+platform
  // suffix stays (we only run nix chromium on linux; the chrome version is
  // recorded in CLAUDE.md, not the filename).
  expect: {
    toMatchScreenshot: {
      resolveScreenshotPath: ({
        root,
        arg,
        ext,
        browserName,
        platform,
      }: {
        root: string
        arg: string
        ext: string
        browserName: string
        platform: string
      }) => `${root}/src/components/__snaps__/${arg}-${browserName}-${platform}${ext}`,
      // On mismatch the reference/actual/diff copies (arg suffixed
      // -reference/-actual/-diff) go to a git-ignored diffs/ beside the
      // baselines, not the default attachmentsDir.
      resolveDiffPath: ({
        root,
        arg,
        ext,
        browserName,
        platform,
      }: {
        root: string
        arg: string
        ext: string
        browserName: string
        platform: string
      }) => `${root}/src/components/__snaps__/diffs/${arg}-${browserName}-${platform}${ext}`,
    },
  },
})

// Two browser-mode projects on one runner:
// - storybook: runs every story as a test (play fns -> behavior, addon-a11y -> axe).
// - visual:    plain *.test.ts (composeStories) for toMatchScreenshot regression.
//   The screenshot matcher only exists under Vitest browser mode, so it lives here
//   rather than in story play fns (which also run in Storybook dev).
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  // Pre-bundle Vue so browser-mode doesn't reload mid-run (flaky test warning).
  optimizeDeps: { include: ['vue'] },
  test: {
    projects: [
      {
        extends: true,
        plugins: [storybookTest({ configDir: `${dirname}.storybook` })],
        test: { name: 'storybook', setupFiles: [setup], browser: browser() },
      },
      {
        extends: true,
        test: {
          name: 'visual',
          include: ['src/**/*.test.ts'],
          setupFiles: [setup],
          browser: browser(),
        },
      },
    ],
  },
})
