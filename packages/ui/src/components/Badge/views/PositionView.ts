import { defineComponent } from 'vue'
import Badge from '../AtBadge.vue'

const positions = ['top-right', 'top-left', 'bottom-right', 'bottom-left'] as const

// Each corner against a plain box standing in for the icon/avatar a
// notification badge would decorate -- the box carries `relative` since
// Badge only owns its own `absolute` offset, not the ancestor's context.
export const PositionView = defineComponent({
  components: { Badge },
  setup: () => ({ positions }),
  template: `
    <div class="flex items-center gap-6">
      <div
        v-for="position in positions"
        :key="position"
        class="relative size-10 rounded-md bg-surface-strong"
      >
        <Badge :position="position" intent="danger" size="sm" />
      </div>
    </div>
  `,
})
