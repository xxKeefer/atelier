import { PhGear, PhHouse, PhUser } from '@phosphor-icons/vue'
import { defineComponent, ref } from 'vue'
import Tabs from '../AtTabs.vue'
import TabsList from '../AtTabsList.vue'
import TabsTrigger from '../AtTabsTrigger.vue'
import TabsContent from '../AtTabsContent.vue'
import Icon from '../../Icon/AtIcon.vue'

// An icon (via the #left slot, AtButton-style) beside each trigger's label.
export const WithIconsView = defineComponent({
  components: { Tabs, TabsList, TabsTrigger, TabsContent, Icon },
  setup: () => ({ selected: ref('home'), PhHouse, PhUser, PhGear }),
  template: `
    <Tabs v-model="selected">
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
      <TabsContent value="profile">Profile content.</TabsContent>
      <TabsContent value="settings">Settings content.</TabsContent>
    </Tabs>
  `,
})
