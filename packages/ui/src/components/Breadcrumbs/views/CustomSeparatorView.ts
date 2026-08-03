import { defineComponent } from 'vue'
import { PhArrowRight } from '@phosphor-icons/vue'
import Breadcrumbs from '../AtBreadcrumbs.vue'
import BreadcrumbItem from '../AtBreadcrumbItem.vue'

export const CustomSeparatorView = defineComponent({
  components: { Breadcrumbs, BreadcrumbItem },
  setup: () => ({ PhArrowRight }),
  template: `
    <Breadcrumbs :separator="PhArrowRight">
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem href="/settings">Settings</BreadcrumbItem>
      <BreadcrumbItem current>Profile</BreadcrumbItem>
    </Breadcrumbs>
  `,
})
