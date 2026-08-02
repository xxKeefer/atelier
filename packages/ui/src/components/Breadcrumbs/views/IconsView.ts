import { defineComponent } from 'vue'
import { PhFolder, PhGear, PhHouse } from '@phosphor-icons/vue'
import Breadcrumbs from '../AtBreadcrumbs.vue'
import BreadcrumbItem from '../AtBreadcrumbItem.vue'

export const IconsView = defineComponent({
  components: { Breadcrumbs, BreadcrumbItem },
  setup: () => ({ PhHouse, PhFolder, PhGear }),
  template: `
    <Breadcrumbs>
      <BreadcrumbItem href="/" :icon="PhHouse">Home</BreadcrumbItem>
      <BreadcrumbItem href="/projects" :icon="PhFolder">Projects</BreadcrumbItem>
      <BreadcrumbItem current :icon="PhGear">Settings</BreadcrumbItem>
    </Breadcrumbs>
  `,
})
