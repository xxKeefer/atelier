import { defineComponent } from 'vue'
import Image from '../AtImage.vue'
import { placeholderSrc, placeholderSrc2x } from './PlaceholderSrc'

// srcset density descriptors -- the browser picks the asset for the screen's DPR.
export const DensityView = defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names -- registering the imported AtImage component, not defining a new one named "Image".
  components: { Image },
  setup: () => ({ placeholderSrc, placeholderSrc2x }),
  template: `
    <Image
      :src="placeholderSrc"
      :srcset="\`\${placeholderSrc} 1x, \${placeholderSrc2x} 2x\`"
      alt=""
      :width="80"
      :height="80"
    />
  `,
})
