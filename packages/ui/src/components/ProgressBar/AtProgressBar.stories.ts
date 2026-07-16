import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ProgressBar from './AtProgressBar.vue'
import { SizesView } from './views/SizesView'
import { StatesView } from './views/StatesView'

const meta = {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    value: { control: 'number' },
    max: { control: 'number' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    label: { control: 'text' },
    ariaLabel: { control: 'text' },
  },
  args: { value: 60, max: 100, size: 'md', label: 'Uploading file' },
} satisfies Meta<typeof ProgressBar>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => ({
    components: { ProgressBar },
    setup: () => ({ args }),
    template: `<ProgressBar v-bind="args" class="w-96" />`,
  }),
}

export const Sizes: Story = {
  render: () => ({ components: { SizesView }, template: `<SizesView />` }),
}

export const States: Story = {
  render: () => ({ components: { StatesView }, template: `<StatesView />` }),
}

// The visual board: every size, plus determinate/indeterminate/labelled states.
// Baseline: __snaps__/progressbar-chromium-linux.png.
export const Snapshot: Story = {
  render: () => ({
    components: { SizesView, StatesView },
    template: `
      <div class="flex w-96 flex-col gap-6 bg-bg-default p-6" data-testid="snap-board">
        <SizesView />
        <StatesView />
      </div>
    `,
  }),
}
