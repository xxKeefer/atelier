import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';

const dirname = fileURLToPath(new URL('.', import.meta.url));
const setup = `${dirname}.storybook/vitest.setup.ts`;

// Nix-provided Playwright chromium for every project. See flake.nix /
// decisions/0005 for the NixOS browser provisioning. A factory so each project
// gets its own provider + instances (shared references collide on project names).
const browser = () => ({
  enabled: true,
  headless: true,
  provider: playwright(),
  instances: [{ browser: 'chromium' as const }]
});

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
        test: { name: 'storybook', setupFiles: [setup], browser: browser() }
      },
      {
        extends: true,
        test: {
          name: 'visual',
          include: ['src/**/*.test.ts'],
          setupFiles: [setup],
          browser: browser()
        }
      }
    ]
  }
});
