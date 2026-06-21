import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

const dirname = fileURLToPath(new URL('.', import.meta.url));

// Browser-mode Vitest: runs every story as a test (play fns -> behavior,
// addon-a11y -> axe) in a Nix-provided Playwright chromium. See flake.nix /
// decisions/0005 for the NixOS browser provisioning.
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    storybookTest({ configDir: `${dirname}.storybook` })
  ],
  // Pre-bundle Vue so browser-mode doesn't reload mid-run (flaky test warning).
  optimizeDeps: { include: ['vue'] },
  test: {
    setupFiles: [`${dirname}.storybook/vitest.setup.ts`],
    browser: {
      enabled: true,
      headless: true,
      provider: 'playwright',
      instances: [{ browser: 'chromium' }]
    }
  }
});
