import { defineComponent } from 'vue'
import Image from '../AtImage.vue'
import { placeholderSrc } from './PlaceholderSrc'

// No fixed width/height: the image fills its parent's width and derives its
// height from aspectRatio, scaling dynamically with the container.
export const AspectRatioView = defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names -- registering the imported AtImage component, not defining a new one named "Image".
  components: { Image },
  setup: () => ({ placeholderSrc }),
  template: `
    <div class="flex gap-4">
      <div class="w-48">
        <Image :src="placeholderSrc" alt="" aspect-ratio="16/9" />
      </div>
      <div class="w-32">
        <Image :src="placeholderSrc" alt="" aspect-ratio="1/1" />
      </div>
    </div>
  `,
})
