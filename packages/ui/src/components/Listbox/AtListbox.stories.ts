import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PhShoppingCart } from '@phosphor-icons/vue'
import { ref } from 'vue'
import Listbox from './AtListbox.vue'
import ListboxFilter from './AtListboxFilter.vue'
import ListboxGroup from './AtListboxGroup.vue'
import ListboxGroupLabel from './AtListboxGroupLabel.vue'
import ListboxItem from './AtListboxItem.vue'
import Icon from '../Icon/AtIcon.vue'

const meta = {
  title: 'Components/Listbox',
  component: Listbox,
  // Fail the Vitest run on any axe violation, not just warn.
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof Listbox>

export default meta
type Story = StoryObj<typeof meta>

// A bare, always-in-flow selectable list -- unlike Select/Dropdown, there is
// no trigger to open; the options are always visible.
export const Playground: Story = {
  render: () => ({
    components: { Listbox, ListboxItem },
    template: `
      <Listbox aria-label="Fruit" class="w-64">
        <ListboxItem value="apple">Apple</ListboxItem>
        <ListboxItem value="banana">Banana</ListboxItem>
        <ListboxItem value="cherry">Cherry</ListboxItem>
      </Listbox>
    `,
  }),
}

// Arbitrary per-item content: not just plain label strings -- an icon
// alongside text works the same as any other slotted content.
export const WithIcons: Story = {
  render: () => ({
    components: { Listbox, ListboxItem, Icon },
    setup: () => ({ PhShoppingCart }),
    template: `
      <Listbox aria-label="Fruit" class="w-64">
        <ListboxItem value="apple" class="gap-2">
          <Icon :icon="PhShoppingCart" />
          Apple
        </ListboxItem>
        <ListboxItem value="banana" class="gap-2">
          <Icon :icon="PhShoppingCart" />
          Banana
        </ListboxItem>
      </Listbox>
    `,
  }),
}

// Groups: items organised under a labelled heading. Ungrouped items and
// grouped items can coexist in the same list.
export const Grouped: Story = {
  render: () => ({
    components: { Listbox, ListboxGroup, ListboxGroupLabel, ListboxItem },
    template: `
      <Listbox aria-label="Produce" class="w-64">
        <ListboxGroup>
          <template #label><ListboxGroupLabel>Fruit</ListboxGroupLabel></template>
          <ListboxItem value="apple">Apple</ListboxItem>
          <ListboxItem value="banana">Banana</ListboxItem>
        </ListboxGroup>
        <ListboxGroup>
          <template #label><ListboxGroupLabel>Vegetables</ListboxGroupLabel></template>
          <ListboxItem value="carrot">Carrot</ListboxItem>
          <ListboxItem value="daikon">Daikon</ListboxItem>
        </ListboxGroup>
      </Listbox>
    `,
  }),
}

// A disabled item is excluded from keyboard navigation and selection, and
// reads dimmed.
export const WithDisabledItem: Story = {
  render: () => ({
    components: { Listbox, ListboxItem },
    template: `
      <Listbox aria-label="Fruit" class="w-64">
        <ListboxItem value="apple">Apple</ListboxItem>
        <ListboxItem value="banana" disabled>Banana</ListboxItem>
        <ListboxItem value="cherry">Cherry</ListboxItem>
      </Listbox>
    `,
  }),
}

// Multi-select: modelValue is an array, selecting an item toggles its
// membership instead of replacing the selection. Selected rows get an
// explicit checkmark on top of the Phase 1 pinned-rung chrome.
export const Multiple: Story = {
  render: () => ({
    components: { Listbox, ListboxItem },
    template: `
      <Listbox aria-label="Fruit" multiple :model-value="['banana', 'cherry']" class="w-64">
        <ListboxItem value="apple">Apple</ListboxItem>
        <ListboxItem value="banana">Banana</ListboxItem>
        <ListboxItem value="cherry">Cherry</ListboxItem>
      </Listbox>
    `,
  }),
}

// Zero items: a static, non-interactive row takes the place of the list,
// with the same recessed/flat chrome as a normal row.
export const Empty: Story = {
  render: () => ({
    components: { Listbox },
    template: '<Listbox aria-label="Fruit" class="w-64" />',
  }),
}

// Filterable: AtListboxFilter (slotted in via #filter) filters visible items
// by label substring. Items need a `label` prop for matching, since content
// is arbitrarily slotted. Selection survives a filter change -- try typing
// "an" then clearing it, Banana stays selected throughout.
export const Filterable: Story = {
  render: () => ({
    components: { Listbox, ListboxFilter, ListboxItem },
    setup: () => ({ filterText: ref(''), selected: ref('banana') }),
    template: `
      <Listbox v-model="selected" aria-label="Fruit" class="w-64">
        <template #filter>
          <ListboxFilter v-model="filterText" aria-label="Filter fruit" placeholder="Search..." />
        </template>
        <ListboxItem value="apple" label="Apple">Apple</ListboxItem>
        <ListboxItem value="banana" label="Banana">Banana</ListboxItem>
        <ListboxItem value="cherry" label="Cherry">Cherry</ListboxItem>
        <ListboxItem value="date" label="Date">Date</ListboxItem>
      </Listbox>
    `,
  }),
}

// A filter matching nothing falls back to the same empty-state row Phase 1
// uses for a structurally empty list.
export const FilterNoMatches: Story = {
  render: () => ({
    components: { Listbox, ListboxFilter, ListboxItem },
    template: `
      <Listbox aria-label="Fruit" class="w-64">
        <template #filter><ListboxFilter aria-label="Filter fruit" modelValue="zzz" /></template>
        <ListboxItem value="apple" label="Apple">Apple</ListboxItem>
        <ListboxItem value="banana" label="Banana">Banana</ListboxItem>
      </Listbox>
    `,
  }),
}

// The visual board: every axis in one labelled grid. Baseline:
// __snaps__/listbox-chromium-linux.png.
export const Snapshot: Story = {
  render: () => ({
    components: { Listbox, ListboxFilter, ListboxGroup, ListboxGroupLabel, ListboxItem },
    template: `
      <div class="flex w-[960px] flex-col gap-8 bg-bg-default p-6" data-testid="snap-board">
        <section class="flex flex-col gap-4">
          <h2 class="font-heading text-lg font-bold text-fg-default">Single-select</h2>
          <div class="flex flex-wrap items-start gap-6">
            <Listbox aria-label="Fruit" modelValue="banana" class="w-64">
              <ListboxItem value="apple">Apple</ListboxItem>
              <ListboxItem value="banana">Banana</ListboxItem>
              <ListboxItem value="cherry" disabled>Cherry</ListboxItem>
              <ListboxItem value="date">Date</ListboxItem>
            </Listbox>

            <Listbox aria-label="Empty" class="w-64" />
          </div>
        </section>

        <section class="flex flex-col gap-4">
          <h2 class="font-heading text-lg font-bold text-fg-default">Multi-select</h2>
          <div class="flex flex-wrap items-start gap-6">
            <Listbox aria-label="Fruit (multi)" multiple :model-value="['banana', 'cherry']" class="w-64">
              <ListboxItem value="apple">Apple</ListboxItem>
              <ListboxItem value="banana">Banana</ListboxItem>
              <ListboxItem value="cherry">Cherry</ListboxItem>
              <ListboxItem value="date" disabled>Date</ListboxItem>
            </Listbox>
          </div>
        </section>

        <section class="flex flex-col gap-4">
          <h2 class="font-heading text-lg font-bold text-fg-default">Grouped</h2>
          <div class="flex flex-wrap items-start gap-6">
            <Listbox aria-label="Produce" modelValue="carrot" class="w-64">
              <ListboxGroup>
                <template #label><ListboxGroupLabel>Fruit</ListboxGroupLabel></template>
                <ListboxItem value="apple">Apple</ListboxItem>
                <ListboxItem value="banana">Banana</ListboxItem>
              </ListboxGroup>
              <ListboxGroup>
                <template #label><ListboxGroupLabel>Vegetables</ListboxGroupLabel></template>
                <ListboxItem value="carrot">Carrot</ListboxItem>
                <ListboxItem value="daikon">Daikon</ListboxItem>
              </ListboxGroup>
            </Listbox>
          </div>
        </section>

        <section class="flex flex-col gap-4">
          <h2 class="font-heading text-lg font-bold text-fg-default">Filterable</h2>
          <div class="flex flex-wrap items-start gap-6">
            <Listbox aria-label="Fruit" modelValue="banana" class="w-64">
              <template #filter><ListboxFilter aria-label="Filter fruit" modelValue="an" placeholder="Search..." /></template>
              <ListboxItem value="apple" label="Apple">Apple</ListboxItem>
              <ListboxItem value="banana" label="Banana">Banana</ListboxItem>
              <ListboxItem value="cherry" label="Cherry">Cherry</ListboxItem>
              <ListboxItem value="date" label="Date">Date</ListboxItem>
            </Listbox>

            <Listbox aria-label="Fruit (no matches)" class="w-64">
              <template #filter><ListboxFilter aria-label="Filter fruit" modelValue="zzz" /></template>
              <ListboxItem value="apple" label="Apple">Apple</ListboxItem>
              <ListboxItem value="banana" label="Banana">Banana</ListboxItem>
            </Listbox>
          </div>
        </section>
      </div>
    `,
  }),
}
