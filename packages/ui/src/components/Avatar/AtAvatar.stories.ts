import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Avatar from './AtAvatar.vue'
import { SizesView, sizes } from './views/SizesView'
import { ShapesView, shapes } from './views/ShapesView'
import { FallbackView } from './views/FallbackView'
import { placeholderSrc } from './views/PlaceholderSrc'

const meta = {
  title: 'Data Display/Avatar',
  component: Avatar,
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    src: { control: 'text' },
    alt: { control: 'text' },
    initials: { control: 'text' },
    size: { control: 'select', options: sizes },
    shape: { control: 'select', options: shapes },
    label: { control: 'text' },
  },
  args: { src: placeholderSrc, alt: '' },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => ({
    components: { Avatar },
    setup: () => ({ args }),
    template: `<Avatar v-bind="args" />`,
  }),
}

export const Sizes: Story = {
  render: () => ({ components: { SizesView }, template: `<SizesView />` }),
}

export const Shapes: Story = {
  render: () => ({ components: { ShapesView }, template: `<ShapesView />` }),
}

// Left to right: loaded image, failed image falling back to initials, initials
// with no image, and a glyph fallback with an accessible label.
export const Fallback: Story = {
  render: () => ({ components: { FallbackView }, template: `<FallbackView />` }),
}

// The visual board: sizes, shapes, and every fallback state on one screen.
export const Snapshot: Story = {
  render: () => ({
    components: { SizesView, ShapesView, FallbackView },
    template: `
      <div class="flex w-max flex-col gap-8 bg-bg-default p-6 text-fg-default" data-testid="snap-board">
        <section class="flex flex-col gap-2">
          <h2 class="font-heading font-bold text-lg">Sizes</h2>
          <SizesView />
        </section>
        <section class="flex flex-col gap-2">
          <h2 class="font-heading font-bold text-lg">Shapes</h2>
          <ShapesView />
        </section>
        <section class="flex flex-col gap-2">
          <h2 class="font-heading font-bold text-lg">Fallback</h2>
          <FallbackView />
        </section>
      </div>
    `,
  }),
}
