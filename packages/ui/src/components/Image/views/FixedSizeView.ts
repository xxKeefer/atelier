import { defineComponent } from 'vue'
import Image from '../AtImage.vue'
import { placeholderSrc } from './PlaceholderSrc'

// Explicit width/height: the image renders at those pixel dimensions regardless
// of its parent, cropping to fill (object-cover).
export const FixedSizeView = defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names -- registering the imported AtImage component, not defining a new one named "Image".
  components: { Image },
  setup: () => ({ placeholderSrc }),
  template: `
    <div class="flex items-end gap-4">
      <Image :src="placeholderSrc" alt="" :width="80" :height="80" />
      <Image :src="placeholderSrc" alt="" :width="160" :height="80" />
      <Image :src="placeholderSrc" alt="" :width="80" :height="160" />
    </div>
  `,
})
