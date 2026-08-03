import { defineComponent } from 'vue'
import Avatar from '../AtAvatar.vue'
import { placeholderSrc } from './PlaceholderSrc'

export const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

export const SizesView = defineComponent({
  components: { Avatar },
  setup: () => ({ sizes, placeholderSrc }),
  template: `
    <div class="flex items-end gap-4">
      <Avatar v-for="size in sizes" :key="size" :size="size" :src="placeholderSrc" alt="" />
    </div>
  `,
})
