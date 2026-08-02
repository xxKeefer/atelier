import { defineComponent } from 'vue'
import Breadcrumbs from '../AtBreadcrumbs.vue'
import BreadcrumbItem from '../AtBreadcrumbItem.vue'

export const DisabledItemView = defineComponent({
  components: { Breadcrumbs, BreadcrumbItem },
  template: `
    <Breadcrumbs>
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem href="/archived" disabled>Archived project</BreadcrumbItem>
      <BreadcrumbItem current>Report</BreadcrumbItem>
    </Breadcrumbs>
  `,
})
