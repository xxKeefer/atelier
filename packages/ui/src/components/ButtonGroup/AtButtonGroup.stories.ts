import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { defineComponent, ref } from 'vue'
import ButtonGroup from './AtButtonGroup.vue'
import ButtonGroupItem from './AtButtonGroupItem.vue'

const meta = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  // Fail the Vitest run on any axe violation, not just warn.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    label: { control: 'text' },
    disabled: { control: 'boolean' },
    error: { control: 'text' },
  },
  args: { label: 'Alignment', disabled: false },
} satisfies Meta<typeof ButtonGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => ({
    components: { ButtonGroup, ButtonGroupItem },
    setup: () => ({ args, selected: ref('left') }),
    template: `
      <ButtonGroup v-bind="args" v-model="selected">
        <ButtonGroupItem value="left">Left</ButtonGroupItem>
        <ButtonGroupItem value="center">Center</ButtonGroupItem>
        <ButtonGroupItem value="right">Right</ButtonGroupItem>
      </ButtonGroup>
    `,
  }),
}

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => ({
    components: { ButtonGroup, ButtonGroupItem },
    setup: () => ({ args }),
    template: `
      <ButtonGroup v-bind="args" modelValue="left">
        <ButtonGroupItem value="left">Left</ButtonGroupItem>
        <ButtonGroupItem value="center">Center</ButtonGroupItem>
        <ButtonGroupItem value="right">Right</ButtonGroupItem>
      </ButtonGroup>
    `,
  }),
}

export const ErrorState: Story = {
  args: { error: 'You must choose an alignment to continue' },
  render: (args) => ({
    components: { ButtonGroup, ButtonGroupItem },
    setup: () => ({ args }),
    template: `
      <ButtonGroup v-bind="args">
        <ButtonGroupItem value="left">Left</ButtonGroupItem>
        <ButtonGroupItem value="center">Center</ButtonGroupItem>
        <ButtonGroupItem value="right">Right</ButtonGroupItem>
      </ButtonGroup>
    `,
  }),
}

// The visual board: rest/checked, disabled, error, and a two-segment run --
// one screen, one screenshot.
const SnapshotView = defineComponent({
  components: { ButtonGroup, ButtonGroupItem },
  template: `
    <div class="flex w-max flex-col gap-8 bg-bg-default p-6" data-testid="snap-board">
      <section class="flex flex-col gap-3">
        <h2 class="font-heading font-bold text-fg-default text-lg">Group</h2>
        <ButtonGroup label="Alignment" modelValue="center">
          <ButtonGroupItem value="left">Left</ButtonGroupItem>
          <ButtonGroupItem value="center">Center</ButtonGroupItem>
          <ButtonGroupItem value="right">Right</ButtonGroupItem>
        </ButtonGroup>
      </section>

      <section class="flex flex-col gap-3">
        <h2 class="font-heading font-bold text-fg-default text-lg">Disabled</h2>
        <ButtonGroup label="Alignment" modelValue="center" disabled>
          <ButtonGroupItem value="left">Left</ButtonGroupItem>
          <ButtonGroupItem value="center">Center</ButtonGroupItem>
          <ButtonGroupItem value="right">Right</ButtonGroupItem>
        </ButtonGroup>
      </section>

      <section class="flex flex-col gap-3">
        <h2 class="font-heading font-bold text-fg-default text-lg">Error</h2>
        <ButtonGroup label="Alignment" error="You must choose an alignment to continue">
          <ButtonGroupItem value="left">Left</ButtonGroupItem>
          <ButtonGroupItem value="center">Center</ButtonGroupItem>
          <ButtonGroupItem value="right">Right</ButtonGroupItem>
        </ButtonGroup>
      </section>

      <section class="flex flex-col gap-3">
        <h2 class="font-heading font-bold text-fg-default text-lg">Two segments</h2>
        <ButtonGroup label="View" modelValue="grid">
          <ButtonGroupItem value="grid">Grid</ButtonGroupItem>
          <ButtonGroupItem value="list">List</ButtonGroupItem>
        </ButtonGroup>
      </section>
    </div>
  `,
})

export const Snapshot: Story = {
  render: () => ({ components: { SnapshotView }, template: `<SnapshotView />` }),
}
