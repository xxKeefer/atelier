import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ToastProvider from './AtToastProvider.vue'
import { QueueingView } from './views/QueueingView'
import { IntentTimeoutsView } from './views/IntentTimeoutsView'
import { ProgrammaticDismissView } from './views/ProgrammaticDismissView'
import { PauseOnHoverView } from './views/PauseOnHoverView'
import { ActionsQueueView } from './views/ActionsQueueView'
import { IntentsView } from './views/IntentsView'
import { PlainView } from './views/PlainView'
import { ComposedView } from './views/ComposedView'
import { NoCloseView } from './views/NoCloseView'
import { ActionsView } from './views/ActionsView'

// AtToastProvider is a singleton mount point, not a props-driven component --
// every story drives it indirectly via useToast().toast() from buttons, the
// same way real consumers would.
const meta = {
  title: 'Components/ToastProvider',
  component: ToastProvider,
  // Fail the Vitest run on any axe violation, not just warn.
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof ToastProvider>

export default meta
type Story = StoryObj<typeof meta>

export const Queueing: Story = {
  render: () => ({ components: { QueueingView }, template: `<QueueingView />` }),
}

export const IntentTimeouts: Story = {
  render: () => ({ components: { IntentTimeoutsView }, template: `<IntentTimeoutsView />` }),
}

export const ProgrammaticDismiss: Story = {
  render: () => ({
    components: { ProgrammaticDismissView },
    template: `<ProgrammaticDismissView />`,
  }),
}

export const PauseOnHover: Story = {
  render: () => ({ components: { PauseOnHoverView }, template: `<PauseOnHoverView />` }),
}

export const WithActions: Story = {
  render: () => ({ components: { ActionsQueueView }, template: `<ActionsQueueView />` }),
}

// The visual board: AtToastProvider always teleports its viewport to
// document.body (no scoped-viewport escape hatch like AtModal's
// disable-teleport), so a board built from live queued toasts can't be
// captured self-contained the way AtModal's snapshot is. Instead this reuses
// AtToast's own snapshot fragments -- the toast shapes AtToastProvider wraps
// -- same as AtToast.stories.ts's board.
export const Snapshot: Story = {
  render: () => ({
    components: { IntentsView, PlainView, ComposedView, NoCloseView, ActionsView },
    template: `
      <div class="flex w-max flex-col gap-6 bg-bg-default p-6" data-testid="snap-board">
        <IntentsView />
        <PlainView />
        <ComposedView />
        <NoCloseView />
        <ActionsView />
      </div>
    `,
  }),
}
