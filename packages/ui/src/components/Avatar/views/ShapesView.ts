import { defineComponent } from 'vue'
import Avatar from '../AtAvatar.vue'
import { placeholderSrc } from './PlaceholderSrc'

export const shapes = ['circle', 'square'] as const

export const ShapesView = defineComponent({
  components: { Avatar },
  setup: () => ({ shapes, placeholderSrc }),
  template: `
    <div class="flex items-end gap-4">
      <Avatar v-for="shape in shapes" :key="shape" :shape="shape" size="lg" :src="placeholderSrc" alt="" />
    </div>
  `,
})
