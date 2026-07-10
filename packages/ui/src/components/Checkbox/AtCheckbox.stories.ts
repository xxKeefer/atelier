import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { defineComponent, ref } from 'vue'
import Checkbox from './AtCheckbox.vue'

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  // Fail the Vitest run on any axe violation, not just warn.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    modelValue: { control: 'select', options: [true, false, 'indeterminate'] },
    label: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  args: { modelValue: false, label: 'Subscribe to updates', disabled: false },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => ({
    components: { Checkbox },
    setup: () => ({ args, checked: ref(args.modelValue) }),
    template: `<Checkbox v-bind="args" v-model="checked" />`,
  }),
}

export const Checked: Story = {
  args: { modelValue: true },
  render: (args) => ({
    components: { Checkbox },
    setup: () => ({ args }),
    template: `<Checkbox v-bind="args" />`,
  }),
}

export const Indeterminate: Story = {
  args: { modelValue: 'indeterminate', label: 'Select all' },
  render: (args) => ({
    components: { Checkbox },
    setup: () => ({ args }),
    template: `<Checkbox v-bind="args" />`,
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: { Checkbox },
    template: `
      <div class="flex flex-col gap-3">
        <Checkbox label="Unchecked, disabled" :modelValue="false" disabled />
        <Checkbox label="Checked, disabled" :modelValue="true" disabled />
        <Checkbox label="Indeterminate, disabled" modelValue="indeterminate" disabled />
      </div>
    `,
  }),
}

export const ErrorState: Story = {
  args: { error: 'You must accept the terms to continue' },
  render: (args) => ({
    components: { Checkbox },
    setup: () => ({ args }),
    template: `<Checkbox v-bind="args" label="Accept the terms" />`,
  }),
}

// No visible label: the accessible name comes from aria-label instead.
export const NoVisibleLabel: Story = {
  render: () => ({
    components: { Checkbox },
    template: `<Checkbox aria-label="Select row" />`,
  }),
}

const states = [
  { name: 'Unchecked', modelValue: false as const },
  { name: 'Checked', modelValue: true as const },
  { name: 'Indeterminate', modelValue: 'indeterminate' as const },
] as const

// The visual board: unchecked/checked/indeterminate, each resting and disabled,
// plus the error state -- one screen, one screenshot.
const SnapshotView = defineComponent({
  components: { Checkbox },
  setup: () => ({ states }),
  template: `
    <div class="flex w-max flex-col gap-8 bg-bg-default p-6" data-testid="snap-board">
      <section class="flex flex-col gap-3">
        <h2 class="font-heading font-bold text-fg-default text-lg">States</h2>
        <div class="flex items-center gap-8">
          <div v-for="state in states" :key="state.name" class="flex flex-col items-start gap-2">
            <span class="font-body text-fg-subtle text-xs">{{ state.name }}</span>
            <Checkbox :label="state.name" :modelValue="state.modelValue" />
          </div>
        </div>
      </section>

      <section class="flex flex-col gap-3">
        <h2 class="font-heading font-bold text-fg-default text-lg">Disabled</h2>
        <div class="flex items-center gap-8">
          <div v-for="state in states" :key="state.name" class="flex flex-col items-start gap-2">
            <span class="font-body text-fg-subtle text-xs">{{ state.name }}</span>
            <Checkbox :label="state.name" :modelValue="state.modelValue" disabled />
          </div>
        </div>
      </section>

      <section class="flex flex-col gap-3">
        <h2 class="font-heading font-bold text-fg-default text-lg">Error &amp; no visible label</h2>
        <div class="flex items-center gap-8">
          <Checkbox label="Accept the terms" error="You must accept the terms to continue" />
          <Checkbox aria-label="Select row" />
        </div>
      </section>
    </div>
  `,
})

export const Snapshot: Story = {
  render: () => ({ components: { SnapshotView }, template: `<SnapshotView />` }),
}
