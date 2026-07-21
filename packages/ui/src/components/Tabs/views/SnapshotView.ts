import { PhGear, PhHouse, PhUser } from '@phosphor-icons/vue'
import { defineComponent } from 'vue'
import Tabs from '../AtTabs.vue'
import TabsList from '../AtTabsList.vue'
import TabsTrigger from '../AtTabsTrigger.vue'
import TabsContent from '../AtTabsContent.vue'
import Icon from '../../Icon/AtIcon.vue'

// The visual board: rest/active/disabled, icons, and a full-width layout --
// one screen, one screenshot.
export const SnapshotView = defineComponent({
  components: { Tabs, TabsList, TabsTrigger, TabsContent, Icon },
  setup: () => ({ PhHouse, PhUser, PhGear }),
  template: `
    <div class="flex w-max flex-col gap-8 bg-bg-default p-6" data-testid="snap-board">
      <section class="flex flex-col gap-3">
        <h2 class="font-heading font-bold text-fg-default text-lg">Default</h2>
        <Tabs modelValue="account">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>
          <TabsContent value="account">Manage your account details here.</TabsContent>
        </Tabs>
      </section>

      <section class="flex flex-col gap-3">
        <h2 class="font-heading font-bold text-fg-default text-lg">Disabled trigger</h2>
        <Tabs modelValue="account">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password" disabled>Password</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>
          <TabsContent value="account">Manage your account details here.</TabsContent>
        </Tabs>
      </section>

      <section class="flex flex-col gap-3">
        <h2 class="font-heading font-bold text-fg-default text-lg">Icons</h2>
        <Tabs modelValue="home">
          <TabsList>
            <TabsTrigger value="home">
              <template #left><Icon :icon="PhHouse" size="sm" /></template>Home
            </TabsTrigger>
            <TabsTrigger value="profile">
              <template #left><Icon :icon="PhUser" size="sm" /></template>Profile
            </TabsTrigger>
            <TabsTrigger value="settings">
              <template #left><Icon :icon="PhGear" size="sm" /></template>Settings
            </TabsTrigger>
          </TabsList>
          <TabsContent value="home">Home content.</TabsContent>
        </Tabs>
      </section>

      <section class="flex w-[28rem] flex-col gap-3">
        <h2 class="font-heading font-bold text-fg-default text-lg">Full width</h2>
        <Tabs modelValue="account">
          <TabsList full-width>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>
          <TabsContent value="account">Manage your account details here.</TabsContent>
        </Tabs>
      </section>

      <section class="flex flex-col gap-3">
        <h2 class="font-heading font-bold text-fg-default text-lg">Flat</h2>
        <Tabs variant="flat" modelValue="account">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password" disabled>Password</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>
          <TabsContent value="account">Manage your account details here.</TabsContent>
        </Tabs>
      </section>
    </div>
  `,
})
