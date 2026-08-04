import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Combobox from './AtCombobox.vue'

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]

const meta = {
  title: 'Components/Combobox',
  component: Combobox,
  // Fail the Vitest run on any axe violation, not just warn.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    help: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  args: { options: fruits },
} satisfies Meta<typeof Combobox>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: { label: 'Fruit', placeholder: 'Choose a fruit' },
  render: (args) => ({
    components: { Combobox },
    setup: () => ({ args }),
    template: '<Combobox v-bind="args" class="w-80" />',
  }),
}

// A labelled field: the label sits above on the surface; clicking it opens
// the combobox, same as AtSelect's WithLabel story.
export const WithLabel: Story = {
  render: () => ({
    components: { Combobox },
    setup: () => ({ fruits }),
    template:
      '<Combobox label="Fruit" :options="fruits" placeholder="Choose a fruit" class="w-80" />',
  }),
}

// A pre-selected field: the clear (X) button shows next to a selected value,
// and resets modelValue back to empty/placeholder when clicked.
export const WithSelection: Story = {
  render: () => ({
    components: { Combobox },
    setup: () => ({ fruits }),
    template:
      '<Combobox label="Fruit" model-value="banana" :options="fruits" placeholder="Choose a fruit" class="w-80" />',
  }),
}

// A bare field: no label. Accessible name comes from a forwarded aria-label.
export const Bare: Story = {
  render: () => ({
    components: { Combobox },
    setup: () => ({ fruits }),
    template:
      '<Combobox aria-label="Fruit" :options="fruits" placeholder="Choose a fruit" class="w-64" />',
  }),
}

// Help text renders in the reserved message line below the field.
export const WithHelp: Story = {
  render: () => ({
    components: { Combobox },
    setup: () => ({ fruits }),
    template:
      '<Combobox label="Fruit" :options="fruits" placeholder="Choose a fruit" help="Pick your favourite" class="w-80" />',
  }),
}

// An error takes the message line's place over help, colours the trigger's
// border danger, and adds a warning icon.
export const WithError: Story = {
  render: () => ({
    components: { Combobox },
    setup: () => ({ fruits }),
    template:
      '<Combobox label="Fruit" :options="fruits" placeholder="Choose a fruit" error="Pick a fruit" class="w-80" />',
  }),
}

// A disabled field: inert to typing, opening, and clearing.
export const Disabled: Story = {
  render: () => ({
    components: { Combobox },
    setup: () => ({ fruits }),
    template:
      '<Combobox label="Fruit" model-value="banana" :options="fruits" placeholder="Choose a fruit" disabled class="w-80" />',
  }),
}

// The visual board: the bare trigger chrome. Baseline: __snaps__/combobox-chromium-linux.png.
export const Snapshot: Story = {
  render: () => ({
    components: { Combobox },
    setup: () => ({ fruits }),
    template: `
      <div class="flex w-[960px] flex-col gap-8 bg-bg-default p-6" data-testid="snap-board">
        <section class="flex flex-col gap-4">
          <h2 class="font-heading text-lg font-bold text-fg-default">Default</h2>
          <div class="flex flex-wrap items-start gap-6">
            <Combobox aria-label="Fruit" :options="fruits" placeholder="Choose a fruit" class="w-72" />
            <Combobox label="Fruit" :options="fruits" placeholder="Choose a fruit" class="w-72" />
            <Combobox label="Fruit" model-value="banana" :options="fruits" placeholder="Choose a fruit" class="w-72" />
          </div>
        </section>

        <section class="flex flex-col gap-4">
          <h2 class="font-heading text-lg font-bold text-fg-default">States</h2>
          <div class="flex flex-wrap items-start gap-6">
            <Combobox label="Fruit" :options="fruits" placeholder="Choose a fruit" help="Pick your favourite" class="w-72" />
            <Combobox label="Fruit" :options="fruits" placeholder="Choose a fruit" error="Pick a fruit" class="w-72" />
            <Combobox label="Fruit" model-value="banana" :options="fruits" placeholder="Choose a fruit" error="Pick a fruit" class="w-72" />
            <Combobox label="Fruit" model-value="banana" :options="fruits" placeholder="Choose a fruit" disabled class="w-72" />
          </div>
        </section>
      </div>
    `,
  }),
}
