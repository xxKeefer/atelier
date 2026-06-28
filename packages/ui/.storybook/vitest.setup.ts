import { afterEach, beforeAll } from 'vitest'
import { cleanup } from '@testing-library/vue'
import { setProjectAnnotations } from '@storybook/vue3-vite'
import * as previewAnnotations from './preview'

// Apply the preview's decorators/parameters (theme wrapper, a11y) to every
// story when it runs as a Vitest test.
const project = setProjectAnnotations([previewAnnotations])

beforeAll(project.beforeAll)

// Vitest runs without `globals: true`, so @testing-library/vue's built-in
// afterEach cleanup never registers. Register it manually -- without it, renders
// accumulate in document.body and cross-test screen queries leak.
afterEach(() => {
  cleanup()
})
