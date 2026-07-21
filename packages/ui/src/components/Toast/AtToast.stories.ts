import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Toast from './AtToast.vue'
import { IntentsView, intents } from './views/IntentsView'
import { PlainView } from './views/PlainView'
import { ComposedView } from './views/ComposedView'
import { TimeoutView } from './views/TimeoutView'
import { ActionsView } from './views/ActionsView'

const meta = {
  title: 'Components/Toast',
  component: Toast,
  // Fail the Vitest run on any axe violation, not just warn.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    intent: { control: 'select', options: intents },
    icon: { control: 'boolean' },
    timeout: { control: 'number' },
  },
  args: { intent: 'info', icon: true },
} satisfies Meta<typeof Toast>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => ({
    components: { Toast },
    setup: () => ({ args }),
    template: `
      <Toast v-bind="args" class="w-96">
        A message describing the notification.
      </Toast>
    `,
  }),
}

export const Intents: Story = {
  render: () => ({ components: { IntentsView }, template: `<IntentsView />` }),
}

export const Plain: Story = {
  render: () => ({ components: { PlainView }, template: `<PlainView />` }),
}

export const Composed: Story = {
  render: () => ({ components: { ComposedView }, template: `<ComposedView />` }),
}

export const Timeout: Story = {
  render: () => ({ components: { TimeoutView }, template: `<TimeoutView />` }),
}

export const Actions: Story = {
  render: () => ({ components: { ActionsView }, template: `<ActionsView />` }),
}

// The visual board: every intent, plus the plain, composed, timeout, and
// actions shapes. Baseline: __snaps__/toast-chromium-linux.png.
export const Snapshot: Story = {
  render: () => ({
    components: { IntentsView, PlainView, ComposedView, TimeoutView, ActionsView },
    template: `
      <div class="flex w-max flex-col gap-6 bg-bg-default p-6" data-testid="snap-board">
        <IntentsView />
        <PlainView />
        <ComposedView />
        <TimeoutView />
        <ActionsView />
      </div>
    `,
  }),
}
