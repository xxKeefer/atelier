import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { defineComponent } from 'vue'
import List from './AtList.vue'
import ListItem from './AtListItem.vue'

const meta = {
  title: 'Components/List',
  component: List,
  // Fail the Vitest run on any axe violation, not just warn.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    variant: { control: 'select', options: ['bulleted', 'numbered', 'plain'] },
  },
  args: { variant: 'bulleted' },
} satisfies Meta<typeof List>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => ({
    components: { List, ListItem },
    setup: () => ({ args }),
    template: `
      <List v-bind="args">
        <ListItem>Apple</ListItem>
        <ListItem>Banana</ListItem>
        <ListItem>Cherry</ListItem>
      </List>
    `,
  }),
}

const SnapshotView = defineComponent({
  components: { List, ListItem },
  template: `
    <div class="flex w-max flex-col gap-8 bg-bg-default p-6" data-testid="snap-board">
      <section class="flex flex-col gap-3">
        <h2 class="font-heading font-bold text-fg-default text-lg">Bulleted</h2>
        <List variant="bulleted">
          <ListItem>Apple</ListItem>
          <ListItem>Banana</ListItem>
          <ListItem>Cherry</ListItem>
        </List>
      </section>

      <section class="flex flex-col gap-3">
        <h2 class="font-heading font-bold text-fg-default text-lg">Numbered</h2>
        <List variant="numbered">
          <ListItem>Apple</ListItem>
          <ListItem>Banana</ListItem>
          <ListItem>Cherry</ListItem>
        </List>
      </section>

      <section class="flex flex-col gap-3">
        <h2 class="font-heading font-bold text-fg-default text-lg">Plain</h2>
        <List variant="plain">
          <ListItem>Apple</ListItem>
          <ListItem>Banana</ListItem>
          <ListItem>Cherry</ListItem>
        </List>
      </section>
    </div>
  `,
})

export const Snapshot: Story = {
  render: () => ({ components: { SnapshotView }, template: `<SnapshotView />` }),
}
