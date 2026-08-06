import { render, screen } from '@testing-library/vue'
import { nextTick } from 'vue'
import { expect, test } from 'vitest'
import { RampPlaygroundView } from './RampPlaygroundView'

// testing-library/vue's fireEvent wraps native dispatch with a dev-mode
// warning helper that reads `process`, undefined in this vitest browser
// project -- dispatch native events directly to sidestep it.
function setInput(el: HTMLInputElement, value: string) {
  el.value = value
  el.dispatchEvent(new Event('input', { bubbles: true }))
}

function click(el: HTMLElement) {
  el.dispatchEvent(new MouseEvent('click', { bubbles: true }))
}

test('ramp slider recomputes palette swatch and semantic control panel value live', async () => {
  render(RampPlaygroundView)

  const wrapper = screen.getByTestId('ramp-playground-wrapper')
  const before = wrapper.style.getPropertyValue('--color-primary-default')

  setInput(screen.getByLabelText('magenta lightness'), '0.2')
  await nextTick()

  const after = wrapper.style.getPropertyValue('--color-primary-default')
  expect(after).not.toBe(before)
  expect(after).toMatch(/^#[0-9a-f]{6}$/)

  const swatches = screen.getByTestId('swatches-magenta')
  expect(swatches.children.length).toBe(11)
})

test('reset restores original palette and semantic values', async () => {
  render(RampPlaygroundView)
  const wrapper = screen.getByTestId('ramp-playground-wrapper')
  const original = wrapper.style.getPropertyValue('--color-primary-default')

  setInput(screen.getByLabelText('magenta hue shift'), '90')
  await nextTick()
  expect(wrapper.style.getPropertyValue('--color-primary-default')).not.toBe(original)

  click(screen.getByTestId('reset-magenta'))
  await nextTick()
  expect(wrapper.style.getPropertyValue('--color-primary-default')).toBe(original)
})
