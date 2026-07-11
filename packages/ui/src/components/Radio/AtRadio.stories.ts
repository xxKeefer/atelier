import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { defineComponent } from 'vue'
import Radio from './AtRadio.vue'
import RadioGroup from './AtRadioGroup.vue'

// A lone RadioGroupItem has no meaning outside a RadioGroupRoot -- it's
// group-only by construction (single-select), unlike Checkbox which is
// self-sufficient standalone. Every story wraps it in AtRadioGroup.
const meta = {
  title: 'Components/Radio',
  component: Radio,
  // Fail the Vitest run on any axe violation, not just warn.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    value: { control: 'text' },
    label: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  args: { value: 'option', label: 'Option' },
} satisfies Meta<typeof Radio>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => ({
    components: { Radio, RadioGroup },
    setup: () => ({ args }),
    template: `<RadioGroup><Radio v-bind="args" /></RadioGroup>`,
  }),
}

export const Checked: Story = {
  render: (args) => ({
    components: { Radio, RadioGroup },
    setup: () => ({ args }),
    template: `<RadioGroup modelValue="option"><Radio v-bind="args" /></RadioGroup>`,
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: { Radio, RadioGroup },
    template: `
      <RadioGroup>
        <Radio value="a" label="Unchecked, disabled" disabled />
      </RadioGroup>
      <RadioGroup modelValue="b">
        <Radio value="b" label="Checked, disabled" disabled />
      </RadioGroup>
    `,
  }),
}

export const ErrorState: Story = {
  args: { error: 'You must choose an option to continue' },
  render: (args) => ({
    components: { Radio, RadioGroup },
    setup: () => ({ args }),
    template: `<RadioGroup><Radio v-bind="args" label="Option" /></RadioGroup>`,
  }),
}

// No visible label: the accessible name comes from aria-label instead.
export const NoVisibleLabel: Story = {
  render: () => ({
    components: { Radio, RadioGroup },
    template: `<RadioGroup><Radio value="a" aria-label="Select row" /></RadioGroup>`,
  }),
}

// The visual board: unchecked/checked, each resting and disabled, plus the
// error state -- one screen, one screenshot.
const SnapshotView = defineComponent({
  components: { Radio, RadioGroup },
  template: `
    <div class="flex w-max flex-col gap-8 bg-bg-default p-6" data-testid="snap-board">
      <section class="flex flex-col gap-3">
        <h2 class="font-heading font-bold text-fg-default text-lg">States</h2>
        <div class="flex items-center gap-8">
          <div class="flex flex-col items-start gap-2">
            <span class="font-body text-fg-subtle text-xs">Unchecked</span>
            <RadioGroup><Radio value="a" label="Unchecked" /></RadioGroup>
          </div>
          <div class="flex flex-col items-start gap-2">
            <span class="font-body text-fg-subtle text-xs">Checked</span>
            <RadioGroup modelValue="a"><Radio value="a" label="Checked" /></RadioGroup>
          </div>
        </div>
      </section>

      <section class="flex flex-col gap-3">
        <h2 class="font-heading font-bold text-fg-default text-lg">Disabled</h2>
        <div class="flex items-center gap-8">
          <div class="flex flex-col items-start gap-2">
            <span class="font-body text-fg-subtle text-xs">Unchecked</span>
            <RadioGroup disabled><Radio value="a" label="Unchecked" /></RadioGroup>
          </div>
          <div class="flex flex-col items-start gap-2">
            <span class="font-body text-fg-subtle text-xs">Checked</span>
            <RadioGroup modelValue="a" disabled><Radio value="a" label="Checked" /></RadioGroup>
          </div>
        </div>
      </section>

      <section class="flex flex-col gap-3">
        <h2 class="font-heading font-bold text-fg-default text-lg">Error &amp; no visible label</h2>
        <div class="flex items-center gap-8">
          <RadioGroup><Radio value="a" label="Option" error="You must choose an option to continue" /></RadioGroup>
          <RadioGroup><Radio value="a" aria-label="Select row" /></RadioGroup>
        </div>
      </section>
    </div>
  `,
})

export const Snapshot: Story = {
  render: () => ({ components: { SnapshotView }, template: `<SnapshotView />` }),
}
