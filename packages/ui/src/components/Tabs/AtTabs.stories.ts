import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PhHouse } from '@phosphor-icons/vue'
import { ref } from 'vue'
import Tabs from './AtTabs.vue'
import TabsList from './AtTabsList.vue'
import TabsTrigger from './AtTabsTrigger.vue'
import TabsContent from './AtTabsContent.vue'
import Icon from '../Icon/AtIcon.vue'
import { WithIconsView } from './views/WithIconsView'
import { SnapshotView } from './views/SnapshotView'

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  // Fail the Vitest run on any axe violation, not just warn.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    variant: { control: 'select', options: ['default', 'flat'] },
  },
  args: { orientation: 'horizontal', variant: 'default' },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => ({
    components: { Tabs, TabsList, TabsTrigger, TabsContent },
    setup: () => ({ args, selected: ref('account') }),
    template: `
      <Tabs v-bind="args" v-model="selected">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>
        <TabsContent value="account">Manage your account details here.</TabsContent>
        <TabsContent value="password">Update your password here.</TabsContent>
        <TabsContent value="team">Invite and manage teammates here.</TabsContent>
      </Tabs>
    `,
  }),
}

export const Flat: Story = {
  render: () => ({
    components: { Tabs, TabsList, TabsTrigger, TabsContent },
    setup: () => ({ selected: ref('account') }),
    template: `
      <Tabs variant="flat" v-model="selected">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>
        <TabsContent value="account">Manage your account details here.</TabsContent>
        <TabsContent value="password">Update your password here.</TabsContent>
        <TabsContent value="team">Invite and manage teammates here.</TabsContent>
      </Tabs>
    `,
  }),
}

export const WithIcons: Story = {
  render: () => ({ components: { WithIconsView }, template: `<WithIconsView />` }),
}

export const Disabled: Story = {
  render: () => ({
    components: { Tabs, TabsList, TabsTrigger, TabsContent },
    setup: () => ({ selected: ref('account') }),
    template: `
      <Tabs v-model="selected">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password" disabled>Password</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>
        <TabsContent value="account">Manage your account details here.</TabsContent>
        <TabsContent value="password">Update your password here.</TabsContent>
        <TabsContent value="team">Invite and manage teammates here.</TabsContent>
      </Tabs>
    `,
  }),
}

export const FullWidth: Story = {
  render: () => ({
    components: { Tabs, TabsList, TabsTrigger, TabsContent },
    setup: () => ({ selected: ref('account') }),
    template: `
      <div class="w-[32rem]">
        <Tabs v-model="selected">
          <TabsList full-width>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>
          <TabsContent value="account">Manage your account details here.</TabsContent>
          <TabsContent value="password">Update your password here.</TabsContent>
          <TabsContent value="team">Invite and manage teammates here.</TabsContent>
        </Tabs>
      </div>
    `,
  }),
}

// Content composition: arbitrary slotted content, including another component.
export const ContentComposition: Story = {
  render: () => ({
    components: { Tabs, TabsList, TabsTrigger, TabsContent, Icon },
    setup: () => ({ selected: ref('list'), PhHouse }),
    template: `
      <Tabs v-model="selected">
        <TabsList>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="card">Card</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <ul class="flex flex-col gap-1">
            <li>First item</li>
            <li>Second item</li>
            <li>Third item</li>
          </ul>
        </TabsContent>
        <TabsContent value="card">
          <div class="flex items-center gap-2 rounded-md border-[3px] border-solid border-border-default bg-surface-default p-4">
            <Icon :icon="PhHouse" />
            <span>Composed content inside a card-like block.</span>
          </div>
        </TabsContent>
      </Tabs>
    `,
  }),
}

export const Snapshot: Story = {
  render: () => ({ components: { SnapshotView }, template: `<SnapshotView />` }),
}
