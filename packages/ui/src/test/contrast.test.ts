/// <reference types="vite/client" />
import { composeStories } from '@storybook/vue3-vite';
import { cleanup, render } from '@testing-library/vue';
import { afterEach, expect, test } from 'vitest';
import { findContrastFailures } from './contrast';

// Every story, every component: render through the real theme decorator and assert
// WCAG AA contrast. New components are covered automatically -- no per-component wiring.
const modules = import.meta.glob('../components/**/*.stories.@(ts|tsx)', { eager: true });

afterEach(() => cleanup());

for (const [path, mod] of Object.entries(modules)) {
  const file = path.split('/').pop();
  const stories = composeStories(mod as Parameters<typeof composeStories>[0]);
  for (const [name, Story] of Object.entries(stories)) {
    test(`contrast (AA): ${file} > ${name}`, async () => {
      render(Story);
      await document.fonts.ready;
      const { failures } = findContrastFailures();
      expect(failures, `\n${JSON.stringify(failures, null, 2)}`).toEqual([]);
    });
  }
}
