/// <reference types="vite/client" />
import { composeStories } from '@storybook/vue3-vite'
import { render } from '@testing-library/vue'
import { expect, test } from 'vitest'
import { findContrastFailures } from './contrast'

// Every story, every component: render through the real theme decorator and assert
// WCAG AA contrast. New components are covered automatically -- no per-component wiring.
// Cleanup between tests is registered globally in .storybook/vitest.setup.ts.
const modules = import.meta.glob('../components/**/*.stories.@(ts|tsx)', { eager: true })

for (const [path, mod] of Object.entries(modules)) {
  const file = path.split('/').pop()
  if (!file) continue
  const stories = composeStories(mod as Parameters<typeof composeStories>[0])
  for (const [name, Story] of Object.entries(stories)) {
    test(`contrast (AA): ${file} > ${name}`, async () => {
      render(Story)
      await document.fonts.ready
      const { failures } = findContrastFailures()
      expect(failures, `\n${JSON.stringify(failures, null, 2)}`).toEqual([])
    })
  }
}
