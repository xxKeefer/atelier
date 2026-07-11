import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PhShoppingCart } from '@phosphor-icons/vue'
import Select from './AtSelect.vue'
import Icon from '../Icon/AtIcon.vue'

const sizes = ['sm', 'md', 'lg'] as const

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]

const meta = {
  title: 'Components/Select',
  component: Select,
  // Fail the Vitest run on any axe violation, not just warn.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    label: { control: 'text' },
    help: { control: 'text' },
    error: { control: 'text' },
    placeholder: { control: 'text' },
    size: { control: 'select', options: sizes },
  },
  args: { size: 'md', options: fruits },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: { label: 'Fruit', placeholder: 'Choose a fruit' },
  render: (args) => ({
    components: { Select },
    setup: () => ({ args }),
    template: '<Select v-bind="args" class="w-80" />',
  }),
}

// A labelled field: the label sits above on the surface; clicking it opens
// the dropdown.
export const WithLabel: Story = {
  render: () => ({
    components: { Select },
    setup: () => ({ fruits }),
    template:
      '<Select label="Fruit" :options="fruits" placeholder="Choose a fruit" class="w-80" />',
  }),
}

// Help text sits in the reserved message line below the field, on the
// normal surface -- not inside the recess.
export const WithHelp: Story = {
  render: () => ({
    components: { Select },
    setup: () => ({ fruits }),
    template:
      '<Select label="Fruit" :options="fruits" placeholder="Choose a fruit" help="Pick your favourite." class="w-80" />',
  }),
}

// Error text takes the message line's place, coloured danger, and adds a
// warning icon in the trigger alongside the chevron.
export const WithError: Story = {
  render: () => ({
    components: { Select },
    setup: () => ({ fruits }),
    template:
      '<Select label="Fruit" :options="fruits" placeholder="Choose a fruit" error="Pick a fruit." class="w-80" />',
  }),
}

// A leading icon at the trigger's start marks the field's purpose. The
// consumer supplies it via the #icon slot (an AtIcon instance) -- the trigger
// only positions it beside the value.
export const WithIcon: Story = {
  render: () => ({
    components: { Select, Icon },
    setup: () => ({ fruits, PhShoppingCart }),
    template: `
      <Select label="Fruit" :options="fruits" placeholder="Choose a fruit" class="w-80">
        <template #icon><Icon :icon="PhShoppingCart" /></template>
      </Select>
    `,
  }),
}

// Prefix/suffix: flush-ganged boxes flanking the trigger for content that
// makes the selection more contextual, e.g. a currency symbol ahead of an
// amount select and a unit label after it.
export const WithPrefixSuffix: Story = {
  render: () => ({
    components: { Select },
    setup: () => ({ fruits }),
    template: `
      <Select label="Fruit" :options="fruits" placeholder="Choose a fruit" class="w-80">
        <template #prefix>$</template>
        <template #suffix>USD</template>
      </Select>
    `,
  }),
}

// Disabled: the trigger goes inert, dimmed, not-allowed cursor. The dropdown
// never opens and the value drops out of the submitted form values.
export const Disabled: Story = {
  render: () => ({
    components: { Select },
    setup: () => ({ fruits }),
    template:
      '<Select label="Fruit" :options="fruits" placeholder="Choose a fruit" disabled class="w-80" />',
  }),
}

// A bare field: no label. Accessible name comes from a forwarded aria-label.
export const Bare: Story = {
  render: () => ({
    components: { Select },
    setup: () => ({ fruits }),
    template:
      '<Select aria-label="Fruit" :options="fruits" placeholder="Choose a fruit" class="w-64" />',
  }),
}

// The visual board: every shape in a wrapping grid. Baseline:
// __snaps__/select-chromium-linux.png.
export const Snapshot: Story = {
  render: () => ({
    components: { Select, Icon },
    setup: () => ({ fruits, sizes, PhShoppingCart }),
    template: `
      <div class="flex w-[960px] flex-col gap-8 bg-bg-default p-6" data-testid="snap-board">
        <section class="flex flex-col gap-4">
          <h2 class="font-heading text-lg font-bold text-fg-default">States</h2>
          <div class="flex flex-wrap items-start gap-6">
            <Select label="Fruit" :options="fruits" placeholder="Choose a fruit" class="w-72" />
            <Select aria-label="Fruit" :options="fruits" placeholder="Choose a fruit" class="w-48" />
            <Select label="Fruit" :options="fruits" placeholder="Choose a fruit" help="Pick your favourite." class="w-72" />
            <Select label="Fruit" :options="fruits" placeholder="Choose a fruit" error="Pick a fruit." class="w-72" />
            <Select label="Fruit" :options="fruits" placeholder="Choose a fruit" disabled class="w-72" />
            <Select label="Fruit" :options="fruits" placeholder="Choose a fruit" class="w-72">
              <template #icon><Icon :icon="PhShoppingCart" /></template>
            </Select>
            <Select label="Fruit" :options="fruits" placeholder="Choose a fruit" class="w-72">
              <template #prefix>$</template>
              <template #suffix>USD</template>
            </Select>
          </div>
        </section>

        <section class="flex flex-col gap-4">
          <h2 class="font-heading text-lg font-bold text-fg-default">Sizes</h2>
          <div class="flex items-start gap-6">
            <Select
              v-for="size in sizes"
              :key="size"
              :size="size"
              :label="size"
              :options="fruits"
              :placeholder="'Size ' + size"
              class="w-64"
            />
          </div>
        </section>
      </div>
    `,
  }),
}
