import { defineComponent } from 'vue'
import Image from '../AtImage.vue'

// Missing src and a failed load both render the same fallback box.
export const FallbackView = defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names -- registering the imported AtImage component, not defining a new one named "Image".
  components: { Image },
  template: `
    <div class="flex items-end gap-4">
      <Image alt="Missing source" :width="80" :height="80" />
      <Image src="/does-not-exist.jpg" alt="Failed to load" :width="80" :height="80" />
    </div>
  `,
})
