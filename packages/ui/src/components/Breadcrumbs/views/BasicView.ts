import { defineComponent } from 'vue'
import Breadcrumbs from '../AtBreadcrumbs.vue'
import BreadcrumbItem from '../AtBreadcrumbItem.vue'

export const BasicView = defineComponent({
  components: { Breadcrumbs, BreadcrumbItem },
  template: `
    <Breadcrumbs>
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem href="/settings">Settings</BreadcrumbItem>
      <BreadcrumbItem current>Profile</BreadcrumbItem>
    </Breadcrumbs>
  `,
})
