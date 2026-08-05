import type { Meta, StoryObj } from '@storybook/vue3-vite'
import AvatarGroup from './AtAvatarGroup.vue'
import { sizes } from './views/SizesView'
import { placeholderSrc } from './views/PlaceholderSrc'

const people = [
  { src: placeholderSrc, alt: 'Jane Smith' },
  { initials: 'AT' },
  { src: placeholderSrc, alt: 'Rin Okafor' },
  { initials: 'MK' },
  { initials: 'PL' },
]

const meta = {
  title: 'Data Display/AvatarGroup',
  component: AvatarGroup,
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    max: { control: 'number' },
    size: { control: 'select', options: sizes },
    shape: { control: 'select', options: ['circle', 'square'] },
    label: { control: 'text' },
  },
  args: { avatars: people, label: 'Project collaborators' },
} satisfies Meta<typeof AvatarGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => ({
    components: { AvatarGroup },
    setup: () => ({ args }),
    template: `<AvatarGroup v-bind="args" />`,
  }),
}

export const Overflow: Story = {
  args: { max: 3 },
  render: (args) => ({
    components: { AvatarGroup },
    setup: () => ({ args }),
    template: `<AvatarGroup v-bind="args" />`,
  }),
}

export const Snapshot: Story = {
  render: () => ({
    components: { AvatarGroup },
    setup: () => ({ people, sizes }),
    template: `
      <div class="flex w-max flex-col gap-6 bg-bg-canvas p-6 text-fg-default" data-testid="snap-board">
        <section class="flex flex-col gap-2">
          <h2 class="font-heading font-bold text-lg">Sizes</h2>
          <div class="flex items-end gap-6">
            <AvatarGroup v-for="size in sizes" :key="size" :avatars="people" :size="size" label="Project collaborators" />
          </div>
        </section>
        <section class="flex flex-col gap-2">
          <h2 class="font-heading font-bold text-lg">Shapes</h2>
          <div class="flex items-end gap-6">
            <AvatarGroup :avatars="people" shape="circle" label="Project collaborators" />
            <AvatarGroup :avatars="people" shape="square" label="Project collaborators" />
          </div>
        </section>
        <section class="flex flex-col gap-2">
          <h2 class="font-heading font-bold text-lg">Overflow</h2>
          <AvatarGroup :avatars="people" :max="3" label="Project collaborators" />
        </section>
      </div>
    `,
  }),
}
