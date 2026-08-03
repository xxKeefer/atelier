import { defineComponent } from 'vue'
import Avatar from '../AtAvatar.vue'
import { placeholderSrc } from './PlaceholderSrc'

export const FallbackView = defineComponent({
  components: { Avatar },
  setup: () => ({ placeholderSrc }),
  template: `
    <div class="flex items-end gap-4">
      <Avatar :src="placeholderSrc" alt="" size="lg" />
      <Avatar src="/broken.jpg" alt="" initials="JS" size="lg" />
      <Avatar initials="AT" size="lg" />
      <Avatar size="lg" label="Unknown user" />
    </div>
  `,
})
