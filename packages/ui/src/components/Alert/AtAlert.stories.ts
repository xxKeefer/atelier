import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Alert from './AtAlert.vue'
import { IntentsView, intents } from './views/IntentsView'
import { ActionsView } from './views/ActionsView'
import { PlainView } from './views/PlainView'

const meta = {
  title: 'Components/Alert',
  component: Alert,
  // Fail the Vitest run on any axe violation, not just warn.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    intent: { control: 'select', options: intents },
    title: { control: 'text' },
    icon: { control: 'boolean' },
  },
  args: { intent: 'neutral', title: 'Heads up', icon: true },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => ({
    components: { Alert },
    setup: () => ({ args }),
    template: `
      <Alert v-bind="args" class="w-96">
        A message describing the alert's context.
      </Alert>
    `,
  }),
}

export const Intents: Story = {
  render: () => ({ components: { IntentsView }, template: `<IntentsView />` }),
}

export const WithActions: Story = {
  render: () => ({ components: { ActionsView }, template: `<ActionsView />` }),
}

export const Plain: Story = {
  render: () => ({ components: { PlainView }, template: `<PlainView />` }),
}

// The visual board: every intent, plus the actions and plain shapes. Baseline:
// __snaps__/alert-chromium-linux.png.
export const Snapshot: Story = {
  render: () => ({
    components: { IntentsView, ActionsView, PlainView },
    template: `
      <div class="flex w-max flex-col gap-6 bg-bg-default p-6" data-testid="snap-board">
        <IntentsView />
        <ActionsView />
        <PlainView />
      </div>
    `,
  }),
}
