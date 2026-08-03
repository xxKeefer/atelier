import { defineComponent } from 'vue'
import Image from '../AtImage.vue'

// A data URI carrying the `image/svg+xml` MIME rather than a ".svg" path -- proves
// detection covers both routes. The shape uses fill="currentColor" so wrapping it
// in a text-colour class recolours the inlined markup, something an
// <img src="*.svg"> cannot do.
const inlineSvg =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="40" fill="currentColor" />
    </svg>`,
  )

export const SvgView = defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names -- registering the imported AtImage component, not defining a new one named "Image".
  components: { Image },
  setup: () => ({ inlineSvg }),
  template: `
    <div class="flex items-end gap-4">
      <Image :src="inlineSvg" alt="A circle" :width="80" :height="80" />
      <div class="text-secondary-default">
        <Image :src="inlineSvg" alt="A circle, recoloured via CSS" :width="80" :height="80" />
      </div>
    </div>
  `,
})
