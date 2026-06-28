import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Input from './AtInput.vue'

const sizes = ['sm', 'md', 'lg'] as const

const meta = {
  title: 'Components/Input',
  component: Input,
  // Fail the Vitest run on any axe violation, not just warn.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    label: { control: 'text' },
    help: { control: 'text' },
    error: { control: 'text' },
    placeholder: { control: 'text' },
    size: { control: 'select', options: sizes },
  },
  args: { size: 'md' },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: { label: 'Label', placeholder: 'Type here' },
  render: (args) => ({
    components: { Input },
    setup: () => ({ args }),
    template: '<Input v-bind="args" class="w-80" />',
  }),
}

// A labelled field: the label sits above on the surface; clicking it focuses the
// recessed input.
export const WithLabel: Story = {
  render: () => ({
    components: { Input },
    template: '<Input label="Full name" placeholder="Ada Lovelace" class="w-80" />',
  }),
}

// Help text reserves a fixed line below the field, on the normal surface.
export const WithHelp: Story = {
  render: () => ({
    components: { Input },
    template: `
      <Input
        label="Password"
        placeholder="••••••••"
        help="At least 8 characters."
        class="w-80"
      />
    `,
  }),
}

// Error text takes the message line's place, coloured danger. It occupies the
// same reserved space as help -- toggling between them never shifts the layout.
export const WithError: Story = {
  render: () => ({
    components: { Input },
    template: `
      <Input
        label="Email"
        placeholder="you@example.com"
        error="Enter a valid email address."
        class="w-80"
      />
    `,
  }),
}

// A bare field: no label, help, or error. It stays vertically compact (no
// reserved message line) for inline use like a filter-bar search. The accessible
// name comes from a forwarded aria-label.
export const Bare: Story = {
  render: () => ({
    components: { Input },
    template: '<Input aria-label="Filter results" placeholder="Filter…" class="w-64" />',
  }),
}

export const Sizes: Story = {
  render: () => ({
    components: { Input },
    setup: () => ({ sizes }),
    template: `
      <div class="flex flex-col gap-4">
        <Input
          v-for="size in sizes"
          :key="size"
          :size="size"
          :label="size"
          :placeholder="'Size ' + size"
          class="w-80"
        />
      </div>
    `,
  }),
}

// The visual board: every shape on one screen. This is the story the snapshot
// test snaps. Baseline: __snaps__/input-chromium-linux.png.
export const Snapshot: Story = {
  render: () => ({
    components: { Input },
    setup: () => ({ sizes }),
    template: `
      <div class="flex w-max flex-col gap-8 bg-bg-default p-6" data-testid="snap-board">
        <section class="flex flex-col gap-4">
          <h2 class="font-heading text-lg font-bold text-fg-default">States</h2>
          <div class="flex items-start gap-6">
            <Input label="Full name" placeholder="Ada Lovelace" class="w-72" />
            <Input label="Password" placeholder="••••••••" help="At least 8 characters." class="w-72" />
            <Input label="Email" placeholder="you@example.com" error="Enter a valid email address." class="w-72" />
            <Input aria-label="Filter" placeholder="Filter…" class="w-48" />
          </div>
        </section>

        <section class="flex flex-col gap-4">
          <h2 class="font-heading text-lg font-bold text-fg-default">Sizes</h2>
          <div class="flex items-start gap-6">
            <Input v-for="size in sizes" :key="size" :size="size" :label="size" :placeholder="'Size ' + size" class="w-64" />
          </div>
        </section>
      </div>
    `,
  }),
}
