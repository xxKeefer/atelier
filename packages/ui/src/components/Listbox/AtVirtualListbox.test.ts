import { composeStories } from '@storybook/vue3-vite'
import { render, screen, within } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { expect, test } from 'vitest'
import { defineComponent } from 'vue'
import VirtualListbox from './AtVirtualListbox.vue'
import * as stories from './AtVirtualListbox.stories'
import { snapBoard } from '../../test/snap'

const { Snapshot } = composeStories(stories)

const options = Array.from({ length: 1000 }, (_, i) => `Option ${String(i)}`)

const FixedHeightListbox = defineComponent({
  components: { VirtualListbox },
  props: {
    options: { type: Array, default: () => options },
    modelValue: { type: [String, Array], default: undefined },
    multiple: { type: Boolean, default: false },
  },
  emits: ['update:modelValue'],
  template: `
    <div style="height: 300px">
      <VirtualListbox
        :options="options"
        :model-value="modelValue"
        :multiple="multiple"
        aria-label="Options"
        @update:model-value="$emit('update:modelValue', $event)"
        #option="{ option }"
      >{{ option }}</VirtualListbox>
    </div>
  `,
})

// Only a windowed subset of a long option set is ever mounted -- proves
// virtualization is active rather than rendering all 1000 options up front.
test('renders fewer options than the total option count for a long list', async () => {
  render(FixedHeightListbox)
  const rendered = await screen.findAllByRole('option')
  expect(rendered.length).toBeGreaterThan(0)
  expect(rendered.length).toBeLessThan(options.length)
})

// Even though only a window of options is mounted, each rendered option
// carries its true position and the true total, same guarantee AtVirtualList
// gives -- so AT announces "item N of 1000" correctly.
test('rendered options carry the true total count and their true index', async () => {
  render(FixedHeightListbox)
  const rendered = await screen.findAllByRole('option')
  for (const node of rendered) {
    expect(node.getAttribute('aria-setsize')).toBe(String(options.length))
    const posinset = Number(node.getAttribute('aria-posinset'))
    expect(posinset).toBeGreaterThanOrEqual(1)
    expect(posinset).toBeLessThanOrEqual(options.length)
    expect(node.textContent).toBe(`Option ${String(posinset - 1)}`)
  }
})

// role="listbox"/"option" and aria-selected still come free from reka-ui
// through the virtualized path, same as the non-virtual AtListbox.
test('exposes listbox/option roles with aria-selected reflecting the selection', async () => {
  render(FixedHeightListbox, { props: { modelValue: 'Option 1' } })
  expect(await screen.findByRole('listbox', { name: 'Options' })).toBeInTheDocument()
  const selected = screen.getByRole('option', { name: 'Option 1' })
  expect(selected).toHaveAttribute('aria-selected', 'true')
})

// Clicking a rendered option selects it, single-select replacing the
// previous selection -- identical contract to AtListbox.
test('clicking an option emits its value', async () => {
  const view = render(FixedHeightListbox, { props: { modelValue: 'Option 0' } })

  await userEvent.click(await screen.findByRole('option', { name: 'Option 1' }))
  expect(view.emitted()['update:modelValue']?.at(-1)).toEqual(['Option 1'])
})

// Multi mode toggles membership in the array instead of replacing the
// selection, same as AtListbox's own multi mode.
test('in multiple mode, clicking an option toggles its membership in the array', async () => {
  const view = render(FixedHeightListbox, {
    props: { multiple: true, modelValue: ['Option 0'] },
  })

  await userEvent.click(await screen.findByRole('option', { name: 'Option 1' }))
  expect(view.emitted()['update:modelValue']?.at(-1)).toEqual([['Option 0', 'Option 1']])
})

// Multi mode's selected options show the same checkmark indicator AtListbox
// uses, on top of the pinned-rung chrome.
test('in multiple mode, selected options show a checkmark indicator', async () => {
  render(FixedHeightListbox, { props: { multiple: true, modelValue: ['Option 0'] } })

  const selected = await screen.findByRole('option', { name: 'Option 0' })
  expect(within(selected).getByTestId('listbox-item-indicator')).toBeInTheDocument()
})

// Arrow keys move the highlighted option and scroll it into view -- free
// from reka-ui's ListboxVirtualizer keydown handling.
test('arrow keys move focus between options', async () => {
  render(FixedHeightListbox)

  await userEvent.tab()
  await expect.element(screen.getByRole('option', { name: 'Option 0' })).toHaveFocus()

  await userEvent.keyboard('{ArrowDown}')
  await expect.element(screen.getByRole('option', { name: 'Option 1' })).toHaveFocus()
})

// Zero options renders the same static empty-state row AtListbox uses.
test('renders a static empty-state row when there are no options', () => {
  render(FixedHeightListbox, { props: { options: [] } })
  expect(screen.getByTestId('listbox-empty')).toBeInTheDocument()
  expect(screen.getByText('No results')).toBeInTheDocument()
  expect(screen.queryByRole('option')).not.toBeInTheDocument()
})

// The single visual snap for VirtualListbox: the Snapshot story's board.
// Baseline: __snaps__/virtual-listbox-chromium-linux.png. Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'virtual-listbox')
})
