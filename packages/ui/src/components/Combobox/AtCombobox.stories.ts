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
  args: { options: fruits },
} satisfies Meta<typeof Combobox>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => ({
    components: { Combobox },
    setup: () => ({ args }),
    template: '<Combobox v-bind="args" aria-label="Fruit" class="w-80" />',
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
            <Combobox aria-label="Fruit" :options="fruits" class="w-72" />
          </div>
        </section>
      </div>
    `,
  }),
}
