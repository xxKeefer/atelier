import { PhCheckSquare } from '@phosphor-icons/vue'
import { defineComponent } from 'vue'
import Badge from '../AtBadge.vue'
import { sizes } from './shared'

// No label at every size, both bare and icon-only, so the circle shape reads
// next to the label-shaped pill the other views show.
export const EmptyView = defineComponent({
  components: { Badge },
  setup: () => ({ sizes, icon: PhCheckSquare }),
  template: `
    <div class="flex items-center gap-3">
      <Badge v-for="size in sizes" :key="size" :size="size" intent="danger" />
      <Badge v-for="size in sizes" :key="size" :size="size" :icon="icon" intent="danger" />
    </div>
  `,
})
