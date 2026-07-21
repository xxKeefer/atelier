import { composeStories } from '@storybook/vue3-vite'
import { render, screen } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { expect, test } from 'vitest'
import { defineComponent } from 'vue'
import Tabs from './AtTabs.vue'
import TabsList from './AtTabsList.vue'
import TabsTrigger from './AtTabsTrigger.vue'
import TabsContent from './AtTabsContent.vue'
import * as stories from './AtTabs.stories'
import { snapBoard } from '../../test/snap'

const { Snapshot } = composeStories(stories)

const ThreeTabs = defineComponent({
  components: { Tabs, TabsList, TabsTrigger, TabsContent },
  props: {
    modelValue: { type: String, default: undefined },
    fullWidth: { type: Boolean, default: false },
  },
  emits: ['update:modelValue'],
  template: `
    <div class="w-[32rem]">
    <Tabs :modelValue="modelValue" @update:modelValue="$emit('update:modelValue', $event)">
      <TabsList :full-width="fullWidth">
        <TabsTrigger value="a">Apple</TabsTrigger>
        <TabsTrigger value="b">Banana</TabsTrigger>
        <TabsTrigger value="c" disabled>Cherry</TabsTrigger>
      </TabsList>
      <TabsContent value="a">Apple content</TabsContent>
      <TabsContent value="b">Banana content</TabsContent>
      <TabsContent value="c">Cherry content</TabsContent>
    </Tabs>
    </div>
  `,
})

// Bare object literal, not defineComponent -- avoids vue/one-component-per-file,
// which only fires on defineComponent-wrapped definitions (ThreeTabs above already
// claims that one).
const TabsWithIcon = {
  components: { Tabs, TabsList, TabsTrigger, TabsContent },
  template: `
    <Tabs modelValue="a">
      <TabsList>
        <TabsTrigger value="a"><template #left><span data-testid="tab-icon" /></template>Apple</TabsTrigger>
      </TabsList>
      <TabsContent value="a">Apple content</TabsContent>
    </Tabs>
  `,
}

// Content composition: arbitrary slotted content renders inside the active panel.
test('renders arbitrary slotted content in the active panel', () => {
  render(ThreeTabs, { props: { modelValue: 'a' } })
  expect(screen.getByText('Apple content')).toBeInTheDocument()
})

// Selected state: exactly one trigger is active/selected at a time.
test('exactly one trigger is selected at a time', () => {
  render(ThreeTabs, { props: { modelValue: 'a' } })
  const tabs = screen.getAllByRole('tab')
  const selected = tabs.filter((t) => t.getAttribute('aria-selected') === 'true')
  expect(selected).toHaveLength(1)
  expect(selected[0]).toHaveTextContent('Apple')
})

// Clicking an unselected trigger selects it and emits its value.
test('emits update:modelValue with the clicked value', async () => {
  const view = render(ThreeTabs, { props: { modelValue: 'a' } })
  await userEvent.click(screen.getByText('Banana'))
  expect(view.emitted()['update:modelValue']?.at(-1)).toEqual(['b'])
})

// Disabled state: an individual trigger's disabled prop reaches the underlying
// element as a native disabled button, which browsers refuse to click --
// this alone rules out it ever becoming selected via pointer interaction.
test('an individual trigger can be disabled', () => {
  render(ThreeTabs, { props: { modelValue: 'a' } })
  expect(screen.getByText('Cherry')).toBeDisabled()
})

// Icon support: content passed to the #left slot renders alongside the label.
test('renders an icon slotted alongside the trigger label', () => {
  render(TabsWithIcon)
  expect(screen.getByTestId('tab-icon')).toBeInTheDocument()
  expect(screen.getByText('Apple')).toBeInTheDocument()
})

// Equal width layout: fullWidth stretches each trigger to share the list's
// width equally. The rule is applied via a descendant selector on the list
// (AtTabsList), not a class on each trigger, so assert the resulting layout
// (equal widths, within a few px -- the border-as-seam mechanic shifts a
// segment's own border between adjacent triggers) rather than a literal
// class string.
test('fullWidth stretches triggers to share the list width equally', () => {
  render(ThreeTabs, { props: { modelValue: 'a', fullWidth: true } })
  const widths = screen.getAllByRole('tab').map((tab) => tab.getBoundingClientRect().width)
  const first = widths[0] ?? 0
  expect(first).toBeGreaterThan(0)
  for (const width of widths) {
    expect(Math.abs(width - first)).toBeLessThan(5)
  }
})

// Keyboard support: ArrowRight moves focus to the next trigger (reka-ui's roving focus).
test('moves focus to the next trigger on ArrowRight', async () => {
  render(ThreeTabs, { props: { modelValue: 'a' } })
  const tabs = screen.getAllByRole('tab')
  tabs[0]?.focus()
  await userEvent.keyboard('[ArrowRight]')
  expect(tabs[1]).toHaveFocus()
})

// Keyboard support: End moves focus/selection to the last enabled trigger.
test('moves focus to the last trigger on End', async () => {
  render(ThreeTabs, { props: { modelValue: 'a' } })
  const tabs = screen.getAllByRole('tab')
  tabs[0]?.focus()
  await userEvent.keyboard('[End]')
  // Cherry (index 2) is disabled, so roving focus lands on Banana, the last enabled trigger.
  expect(tabs[1]).toHaveFocus()
})

// Keyboard support: Home moves focus back to the first trigger.
test('moves focus to the first trigger on Home', async () => {
  render(ThreeTabs, { props: { modelValue: 'a' } })
  const tabs = screen.getAllByRole('tab')
  tabs[1]?.focus()
  await userEvent.keyboard('[Home]')
  expect(tabs[0]).toHaveFocus()
})

// Variants: the Flat variant carries the same selection/disabled/keyboard
// behaviour as Default -- reka-ui owns that regardless of styling, so this
// only asserts the styling seam (variant threaded via provide/inject) works.
const FlatTabs = {
  components: { Tabs, TabsList, TabsTrigger, TabsContent },
  template: `
    <Tabs variant="flat" modelValue="a">
      <TabsList>
        <TabsTrigger value="a">Apple</TabsTrigger>
        <TabsTrigger value="b" disabled>Banana</TabsTrigger>
      </TabsList>
      <TabsContent value="a">Apple content</TabsContent>
      <TabsContent value="b">Banana content</TabsContent>
    </Tabs>
  `,
}

test('Flat variant selects and disables triggers same as Default', () => {
  render(FlatTabs)
  expect(screen.getByText('Apple')).toHaveAttribute('aria-selected', 'true')
  expect(screen.getByText('Banana')).toBeDisabled()
})

// The single visual snap for Tabs: the Snapshot story's board.
// Baseline: __snaps__/tabs-chromium-linux.png. Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'tabs')
})
