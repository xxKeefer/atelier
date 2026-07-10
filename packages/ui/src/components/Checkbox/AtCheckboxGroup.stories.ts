import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { defineComponent, ref } from 'vue'
import CheckboxGroup from './AtCheckboxGroup.vue'
import Checkbox from './AtCheckbox.vue'

const meta = {
  title: 'Components/CheckboxGroup',
  component: CheckboxGroup,
  // Fail the Vitest run on any axe violation, not just warn.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    label: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  args: { label: 'Favourite fruits', disabled: false },
} satisfies Meta<typeof CheckboxGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => ({
    components: { CheckboxGroup, Checkbox },
    setup: () => ({ args, selected: ref(['apple']) }),
    template: `
      <CheckboxGroup v-bind="args" v-model="selected">
        <Checkbox value="apple" label="Apple" />
        <Checkbox value="banana" label="Banana" />
        <Checkbox value="cherry" label="Cherry" />
      </CheckboxGroup>
    `,
  }),
}

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => ({
    components: { CheckboxGroup, Checkbox },
    setup: () => ({ args }),
    template: `
      <CheckboxGroup v-bind="args" :modelValue="['apple']">
        <Checkbox value="apple" label="Apple" />
        <Checkbox value="banana" label="Banana" />
        <Checkbox value="cherry" label="Cherry" />
      </CheckboxGroup>
    `,
  }),
}

// The visual board: a group with a label, one selected, one screenshot.
const SnapshotView = defineComponent({
  components: { CheckboxGroup, Checkbox },
  template: `
    <div class="flex w-max flex-col gap-8 bg-bg-default p-6" data-testid="snap-board">
      <section class="flex flex-col gap-3">
        <h2 class="font-heading font-bold text-fg-default text-lg">Group</h2>
        <CheckboxGroup label="Favourite fruits" :modelValue="['apple']">
          <Checkbox value="apple" label="Apple" />
          <Checkbox value="banana" label="Banana" />
          <Checkbox value="cherry" label="Cherry" />
        </CheckboxGroup>
      </section>

      <section class="flex flex-col gap-3">
        <h2 class="font-heading font-bold text-fg-default text-lg">Disabled</h2>
        <CheckboxGroup label="Favourite fruits" :modelValue="['apple']" disabled>
          <Checkbox value="apple" label="Apple" />
          <Checkbox value="banana" label="Banana" />
          <Checkbox value="cherry" label="Cherry" />
        </CheckboxGroup>
      </section>
    </div>
  `,
})

export const Snapshot: Story = {
  render: () => ({ components: { SnapshotView }, template: `<SnapshotView />` }),
}
