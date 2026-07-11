import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { defineComponent, ref } from 'vue'
import Switch from './AtSwitch.vue'

const meta = {
  title: 'Components/Switch',
  component: Switch,
  // Fail the Vitest run on any axe violation, not just warn.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    modelValue: { control: 'boolean' },
    label: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  args: { modelValue: false, label: 'Enable notifications', disabled: false },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => ({
    components: { Switch },
    setup: () => ({ args, checked: ref(args.modelValue) }),
    template: `<Switch v-bind="args" v-model="checked" />`,
  }),
}

export const Checked: Story = {
  args: { modelValue: true },
  render: (args) => ({
    components: { Switch },
    setup: () => ({ args }),
    template: `<Switch v-bind="args" />`,
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: { Switch },
    template: `
      <div class="flex flex-col gap-3">
        <Switch label="Off, disabled" :modelValue="false" disabled />
        <Switch label="On, disabled" :modelValue="true" disabled />
      </div>
    `,
  }),
}

// No visible label: the accessible name comes from aria-label instead.
export const NoVisibleLabel: Story = {
  render: () => ({
    components: { Switch },
    template: `<Switch aria-label="Enable notifications" />`,
  }),
}

const states = [
  { name: 'Off', modelValue: false as const },
  { name: 'On', modelValue: true as const },
] as const

// The visual board: off/on, each resting and disabled, plus no-visible-label.
const SnapshotView = defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names
  components: { Switch },
  setup: () => ({ states }),
  template: `
    <div class="flex w-max flex-col gap-8 bg-bg-default p-6" data-testid="snap-board">
      <section class="flex flex-col gap-3">
        <h2 class="font-heading font-bold text-fg-default text-lg">States</h2>
        <div class="flex items-center gap-8">
          <div v-for="state in states" :key="state.name" class="flex flex-col items-start gap-2">
            <span class="font-body text-fg-subtle text-xs">{{ state.name }}</span>
            <Switch :label="state.name" :modelValue="state.modelValue" />
          </div>
        </div>
      </section>

      <section class="flex flex-col gap-3">
        <h2 class="font-heading font-bold text-fg-default text-lg">Disabled</h2>
        <div class="flex items-center gap-8">
          <div v-for="state in states" :key="state.name" class="flex flex-col items-start gap-2">
            <span class="font-body text-fg-subtle text-xs">{{ state.name }}</span>
            <Switch :label="state.name" :modelValue="state.modelValue" disabled />
          </div>
        </div>
      </section>

      <section class="flex flex-col gap-3">
        <h2 class="font-heading font-bold text-fg-default text-lg">No visible label</h2>
        <div class="flex items-center gap-8">
          <Switch aria-label="Enable notifications" />
        </div>
      </section>
    </div>
  `,
})

export const Snapshot: Story = {
  render: () => ({ components: { SnapshotView }, template: `<SnapshotView />` }),
}
