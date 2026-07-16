import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { defineComponent } from 'vue'
import ButtonGroup from './AtButtonGroup.vue'
import ButtonGroupItem from './AtButtonGroupItem.vue'

// A lone AtButtonGroupItem has no meaning outside an AtButtonGroup -- it's
// group-only by construction (single-select), like Radio. Every story wraps
// it in AtButtonGroup, whose registration context also gives it its
// first/middle/last position in the run.
const meta = {
  title: 'Components/ButtonGroupItem',
  component: ButtonGroupItem,
  // Fail the Vitest run on any axe violation, not just warn.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    value: { control: 'text' },
  },
  args: { value: 'option' },
} satisfies Meta<typeof ButtonGroupItem>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => ({
    components: { ButtonGroup, ButtonGroupItem },
    setup: () => ({ args }),
    template: `
      <ButtonGroup>
        <ButtonGroupItem v-bind="args">Option</ButtonGroupItem>
        <ButtonGroupItem value="other">Other</ButtonGroupItem>
      </ButtonGroup>
    `,
  }),
}

export const Checked: Story = {
  render: (args) => ({
    components: { ButtonGroup, ButtonGroupItem },
    setup: () => ({ args }),
    template: `
      <ButtonGroup modelValue="option">
        <ButtonGroupItem v-bind="args">Option</ButtonGroupItem>
        <ButtonGroupItem value="other">Other</ButtonGroupItem>
      </ButtonGroup>
    `,
  }),
}

// Disabled is a group-level concern -- a button group either reads as fully
// interactive or fully locked, never a mix of enabled/disabled segments.
export const Disabled: Story = {
  render: () => ({
    components: { ButtonGroup, ButtonGroupItem },
    template: `
      <ButtonGroup modelValue="c" disabled>
        <ButtonGroupItem value="c">Checked</ButtonGroupItem>
        <ButtonGroupItem value="d">Unchecked</ButtonGroupItem>
      </ButtonGroup>
    `,
  }),
}

// The visual board: unchecked/checked, each resting and disabled, across a
// three-segment run so the outer-rounding/border-seam pattern reads.
const SnapshotView = defineComponent({
  components: { ButtonGroup, ButtonGroupItem },
  template: `
    <div class="flex w-max flex-col gap-8 bg-bg-default p-6" data-testid="snap-board">
      <section class="flex flex-col gap-3">
        <h2 class="font-heading font-bold text-fg-default text-lg">States</h2>
        <ButtonGroup modelValue="b">
          <ButtonGroupItem value="a">Rest</ButtonGroupItem>
          <ButtonGroupItem value="b">Checked</ButtonGroupItem>
          <ButtonGroupItem value="c">Rest</ButtonGroupItem>
        </ButtonGroup>
      </section>

      <section class="flex flex-col gap-3">
        <h2 class="font-heading font-bold text-fg-default text-lg">Disabled</h2>
        <ButtonGroup modelValue="b" disabled>
          <ButtonGroupItem value="a">Rest</ButtonGroupItem>
          <ButtonGroupItem value="b">Checked</ButtonGroupItem>
          <ButtonGroupItem value="c">Rest</ButtonGroupItem>
        </ButtonGroup>
      </section>
    </div>
  `,
})

export const Snapshot: Story = {
  render: () => ({ components: { SnapshotView }, template: `<SnapshotView />` }),
}
