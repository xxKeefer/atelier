import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Select from './AtSelect.vue'

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
    components: { Select },
    setup: () => ({ fruits, sizes }),
    template: `
      <div class="flex w-[960px] flex-col gap-8 bg-bg-default p-6" data-testid="snap-board">
        <section class="flex flex-col gap-4">
          <h2 class="font-heading text-lg font-bold text-fg-default">States</h2>
          <div class="flex flex-wrap items-start gap-6">
            <Select label="Fruit" :options="fruits" placeholder="Choose a fruit" class="w-72" />
            <Select aria-label="Fruit" :options="fruits" placeholder="Choose a fruit" class="w-48" />
            <Select label="Fruit" :options="fruits" placeholder="Choose a fruit" disabled class="w-72" />
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
