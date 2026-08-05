import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PhFolderOpen, PhMagnifyingGlass, PhTray } from '@phosphor-icons/vue'
import EmptyState from './AtEmptyState.vue'
import Button from '../Button/AtButton.vue'

const sizes = ['sm', 'md', 'lg'] as const

const meta = {
  title: 'Feedback/EmptyState',
  component: EmptyState,
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    size: { control: 'select', options: sizes },
  },
  args: {
    title: 'No items yet',
    description: 'Items you add will show up here.',
    size: 'md',
  },
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => ({
    components: { EmptyState },
    setup: () => ({ args, PhTray }),
    template: `<EmptyState v-bind="args" :icon="PhTray" />`,
  }),
}

export const WithAction: Story = {
  render: () => ({
    components: { EmptyState, Button },
    setup: () => ({ PhFolderOpen }),
    template: `
      <EmptyState title="No projects" description="Create your first project to get started." :icon="PhFolderOpen">
        <template #actions>
          <Button intent="primary">New project</Button>
        </template>
      </EmptyState>
    `,
  }),
}

export const NoResults: Story = {
  render: () => ({
    components: { EmptyState },
    setup: () => ({ PhMagnifyingGlass }),
    template: `<EmptyState title="No results" description="Try a different search term." :icon="PhMagnifyingGlass" size="sm" />`,
  }),
}

// The visual board: every size, with and without icon/description/actions.
export const Snapshot: Story = {
  render: () => ({
    components: { EmptyState, Button },
    setup: () => ({ sizes, PhTray, PhFolderOpen }),
    template: `
      <div class="flex w-max flex-col gap-8 bg-bg-default p-6" data-testid="snap-board">
        <section v-for="size in sizes" :key="size" class="flex flex-col gap-2">
          <h2 class="font-heading font-bold text-lg text-fg-default">{{ size }}</h2>
          <div class="flex items-start gap-6 border-2 border-dashed border-border-subtle p-4">
            <EmptyState class="w-40" title="No items" :size="size" />
            <EmptyState
              class="w-48"
              title="No items"
              description="Add one to get started."
              :icon="PhTray"
              :size="size"
            />
            <EmptyState
              class="w-56"
              title="No projects"
              description="Create your first project."
              :icon="PhFolderOpen"
              :size="size"
            >
              <template #actions>
                <Button :size="size" intent="primary">New project</Button>
              </template>
            </EmptyState>
          </div>
        </section>
      </div>
    `,
  }),
}
