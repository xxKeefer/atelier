import { defineComponent } from 'vue'
import { PhFolder, PhGear, PhHouse } from '@phosphor-icons/vue'
import Breadcrumbs from '../AtBreadcrumbs.vue'
import BreadcrumbItem from '../AtBreadcrumbItem.vue'

export const CollapsedView = defineComponent({
  components: { Breadcrumbs, BreadcrumbItem },
  setup: () => ({ PhHouse, PhFolder, PhGear }),
  template: `
    <Breadcrumbs :max-items="3">
      <BreadcrumbItem href="/" :icon="PhHouse">Home</BreadcrumbItem>
      <BreadcrumbItem href="/projects">Projects</BreadcrumbItem>
      <BreadcrumbItem href="/projects/atelier">Atelier</BreadcrumbItem>
      <BreadcrumbItem href="/projects/atelier/components" :icon="PhFolder">Components</BreadcrumbItem>
      <BreadcrumbItem current :icon="PhGear">Settings</BreadcrumbItem>
    </Breadcrumbs>
  `,
})
