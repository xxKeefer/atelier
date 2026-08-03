import { PhCheckSquare } from '@phosphor-icons/vue'
import { defineComponent } from 'vue'
import Badge from '../AtBadge.vue'
import { sizes } from './shared'

// Icon at every size, so sm's bumped-up icon size (see AtBadge.vue's
// iconSizes) reads next to the un-bumped sm/md/lg text ladder.
export const IconView = defineComponent({
  components: { Badge },
  setup: () => ({ sizes, icon: PhCheckSquare }),
  template: `
    <div class="flex items-center gap-3">
      <Badge v-for="size in sizes" :key="size" :size="size" :icon="icon" intent="success">
        {{ size }}
      </Badge>
    </div>
  `,
})
