import { composeStories } from '@storybook/vue3-vite';
import { render } from '@testing-library/vue';
import { test } from 'vitest';
import * as stories from './ThemeProof.stories';
import { snapBoard } from '../test/snap';

// Visual regression lives here, not in the story play fns: toMatchScreenshot is a
// Vitest browser-mode matcher and would throw in Storybook's own interactions panel.
// composeStories bakes in the preview theme decorator (via setProjectAnnotations in
// vitest.setup.ts), so the snapshot is taken through the real tokens + fonts.
// Baseline: __snaps__/themeproof-default-chromium-linux.png. Rebaseline: pnpm test:update.
const { Default } = composeStories(stories);

test('Default matches the themed baseline', async () => {
  render(Default);
  await snapBoard('snap-board', 'themeproof-default');
});
