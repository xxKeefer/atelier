import { defineComponent } from 'vue'
import Badge from '../AtBadge.vue'
import { sizes } from './shared'

export const SizesView = defineComponent({
  components: { Badge },
  setup: () => ({ sizes }),
  template: `
    <div class="flex items-center gap-3">
      <Badge v-for="size in sizes" :key="size" :size="size" intent="info">
        {{ size }}
      </Badge>
    </div>
  `,
})
