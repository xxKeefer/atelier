import { composeStories } from '@storybook/vue3-vite';
import { render } from '@testing-library/vue';
import { page } from 'vitest/browser';
import { expect, test } from 'vitest';
import * as stories from './ThemeProof.stories';

// Visual regression lives here, not in the story play fns: toMatchScreenshot is a
// Vitest browser-mode matcher and would throw in Storybook's own interactions panel.
// composeStories bakes in the preview theme decorator (via setProjectAnnotations in
// vitest.setup.ts), so the snapshot is taken through the real tokens + fonts.
// Baselines: __screenshots__/ThemeProof.visual.test.ts/. Rebaseline: pnpm test -u.
const { Default } = composeStories(stories);

test('Default matches the themed baseline', async () => {
  const { baseElement } = render(Default);
  // Wait for the bundled faces or font-display: swap snaps a fallback and the diff flakes.
  await document.fonts.ready;
  await expect.element(page.elementLocator(baseElement)).toMatchScreenshot('themeproof-default', {
    comparatorOptions: { allowedMismatchedPixelRatio: 0.01 }
  });
});
