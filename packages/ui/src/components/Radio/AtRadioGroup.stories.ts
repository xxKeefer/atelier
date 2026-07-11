import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { defineComponent, ref } from 'vue'
import RadioGroup from './AtRadioGroup.vue'
import Radio from './AtRadio.vue'

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  // Fail the Vitest run on any axe violation, not just warn.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    label: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  args: { label: 'Favourite fruit', disabled: false },
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => ({
    components: { RadioGroup, Radio },
    setup: () => ({ args, selected: ref('apple') }),
    template: `
      <RadioGroup v-bind="args" v-model="selected">
        <Radio value="apple" label="Apple" />
        <Radio value="banana" label="Banana" />
        <Radio value="cherry" label="Cherry" />
      </RadioGroup>
    `,
  }),
}

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => ({
    components: { RadioGroup, Radio },
    setup: () => ({ args }),
    template: `
      <RadioGroup v-bind="args" modelValue="apple">
        <Radio value="apple" label="Apple" />
        <Radio value="banana" label="Banana" />
        <Radio value="cherry" label="Cherry" />
      </RadioGroup>
    `,
  }),
}

// The visual board: a group with a label, one selected, one screenshot.
const SnapshotView = defineComponent({
  components: { RadioGroup, Radio },
  template: `
    <div class="flex w-max flex-col gap-8 bg-bg-default p-6" data-testid="snap-board">
      <section class="flex flex-col gap-3">
        <h2 class="font-heading font-bold text-fg-default text-lg">Group</h2>
        <RadioGroup label="Favourite fruit" modelValue="apple">
          <Radio value="apple" label="Apple" />
          <Radio value="banana" label="Banana" />
          <Radio value="cherry" label="Cherry" />
        </RadioGroup>
      </section>

      <section class="flex flex-col gap-3">
        <h2 class="font-heading font-bold text-fg-default text-lg">Disabled</h2>
        <RadioGroup label="Favourite fruit" modelValue="apple" disabled>
          <Radio value="apple" label="Apple" />
          <Radio value="banana" label="Banana" />
          <Radio value="cherry" label="Cherry" />
        </RadioGroup>
      </section>
    </div>
  `,
})

export const Snapshot: Story = {
  render: () => ({ components: { SnapshotView }, template: `<SnapshotView />` }),
}
