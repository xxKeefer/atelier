import { defineComponent } from 'vue'
import Badge from '../AtBadge.vue'
import { sizes } from './shared'

// Dismissible at every size, so the trailing remove button's icon bump
// (see AtBadge.vue's iconSizes) reads next to the plain label ladder.
export const DismissibleView = defineComponent({
  components: { Badge },
  setup: () => ({ sizes }),
  template: `
    <div class="flex items-center gap-3">
      <Badge v-for="size in sizes" :key="size" :size="size" dismissible intent="info">
        {{ size }}
      </Badge>
    </div>
  `,
})
