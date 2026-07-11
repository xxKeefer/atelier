import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Modal from './AtModal.vue'
import Button from '../Button/AtButton.vue'

const positions = ['center', 'left', 'right', 'top', 'bottom'] as const
const sizes = ['sm', 'md', 'lg', 'full'] as const

const meta = {
  title: 'Components/Modal',
  component: Modal,
  // Fail the Vitest run on any axe violation, not just warn.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
    position: { control: 'select', options: positions },
    size: { control: 'select', options: sizes },
    showCloseButton: { control: 'boolean' },
    defaultOpen: { control: 'boolean' },
  },
  args: {
    title: 'Delete project',
    subtitle: 'This action cannot be undone.',
    position: 'center',
    size: 'md',
    showCloseButton: true,
    defaultOpen: false,
  },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => ({
    components: { Modal, Button },
    setup: () => ({ args }),
    template: `
      <Modal v-bind="args">
        <template #trigger><Button>Open modal</Button></template>
        Are you sure you want to delete this project? All of its data will be removed.
        <template #footer>
          <Button variant="flat" intent="neutral">Cancel</Button>
          <Button intent="danger">Delete</Button>
        </template>
      </Modal>
    `,
  }),
}

// Positioning: center is a floating dialog, the four edges slide in as sheets.
export const Positions: Story = {
  render: () => ({
    components: { Modal, Button },
    setup: () => ({ positions }),
    template: `
      <div class="flex flex-wrap gap-4">
        <Modal v-for="position in positions" :key="position" :position="position" :title="position">
          <template #trigger><Button>{{ position }}</Button></template>
          A {{ position }}-positioned modal.
        </Modal>
      </div>
    `,
  }),
}

// Sizes cap the panel's cross-axis dimension so content-heavy modals can grow.
export const Sizes: Story = {
  render: () => ({
    components: { Modal, Button },
    setup: () => ({ sizes }),
    template: `
      <div class="flex flex-wrap gap-4">
        <Modal v-for="size in sizes" :key="size" :size="size" :title="'Size: ' + size">
          <template #trigger><Button>{{ size }}</Button></template>
          Content sized to the {{ size }} panel.
        </Modal>
      </div>
    `,
  }),
}

// No visible title -- the aria-label prop carries the accessible name instead.
export const AriaLabelOnly: Story = {
  args: { title: undefined, subtitle: undefined, ariaLabel: 'Quick preview' },
  render: (args) => ({
    components: { Modal, Button },
    setup: () => ({ args }),
    template: `
      <Modal v-bind="args">
        <template #trigger><Button>Preview</Button></template>
        Unlabelled content, named via aria-label.
      </Modal>
    `,
  }),
}

// The visual board: one representative open modal (title, subtitle, body,
// footer actions). Modals are viewport-covering overlays -- unlike Tooltip's
// grid of simultaneously-open instances, several open modals would just stack
// and occlude each other, so the board shows the component's full chrome once
// rather than every position/size combination (those are covered by the
// Positions/Sizes stories' own play-fn assertions instead).
//
// AtModal's panel is `position: fixed`, normally centering on the whole
// browser viewport via its portal to `document.body`. A `transform` utility
// on the board makes it the CSS containing block for fixed-position
// descendants (spec behaviour), and `disable-teleport` keeps the modal's DOM
// nested inside the board instead of teleported to body -- together they
// scope the "viewport" the modal centers on to the board itself, so the snap
// captures a sized, self-contained board instead of a fixed panel positioned
// relative to the whole (much larger) test viewport.
export const Snapshot: Story = {
  render: () => ({
    components: { Modal, Button },
    setup: () => ({}),
    template: `
      <div
        class="relative h-[26rem] w-[40rem] transform bg-bg-canvas"
        data-testid="snap-board"
      >
        <Modal
          title="Delete project"
          subtitle="This action cannot be undone."
          :default-open="true"
          :disable-teleport="true"
        >
          Are you sure you want to delete this project? All of its data will be removed.
          <template #footer>
            <Button variant="flat" intent="neutral">Cancel</Button>
            <Button intent="danger">Delete</Button>
          </template>
        </Modal>
      </div>
    `,
  }),
}
