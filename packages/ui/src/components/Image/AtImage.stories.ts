import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Image from './AtImage.vue'
import { FixedSizeView } from './views/FixedSizeView'
import { AspectRatioView } from './views/AspectRatioView'
import { placeholderSrc } from './views/PlaceholderSrc'

const meta = {
  title: 'Components/Image',
  component: Image,
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    src: { control: 'text' },
    alt: { control: 'text' },
    width: { control: 'text' },
    height: { control: 'text' },
    aspectRatio: { control: 'text' },
  },
  args: { src: placeholderSrc, alt: 'A decorative geometric placeholder', width: 200, height: 150 },
} satisfies Meta<typeof Image>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => ({
    components: { Image },
    setup: () => ({ args }),
    template: `<Image v-bind="args" />`,
  }),
}

export const FixedSize: Story = {
  render: () => ({ components: { FixedSizeView }, template: `<FixedSizeView />` }),
}

export const AspectRatio: Story = {
  render: () => ({ components: { AspectRatioView }, template: `<AspectRatioView />` }),
}

// The visual board: fixed-size and aspect-ratio-scaled images together.
export const Snapshot: Story = {
  render: () => ({
    components: { FixedSizeView, AspectRatioView },
    template: `
      <div class="flex w-max flex-col gap-8 bg-bg-default p-6 text-fg-default" data-testid="snap-board">
        <section class="flex flex-col gap-2">
          <h2 class="font-heading font-bold text-lg">Fixed size</h2>
          <FixedSizeView />
        </section>
        <section class="flex flex-col gap-2">
          <h2 class="font-heading font-bold text-lg">Aspect ratio</h2>
          <AspectRatioView />
        </section>
      </div>
    `,
  }),
}
