import { defineComponent } from 'vue'
import Card from '../AtCard.vue'

// A stand-in media block: a flat coloured panel standing in for an image so the
// stories carry no asset dependency. Full-bleed on top.
const mediaTop = `<div class="h-32 w-full bg-secondary-default"></div>`

// Full-bleed media band on top, clipped to the card radius.
export const MediaTopView = defineComponent({
  components: { Card },
  template: `
    <Card class="w-80">
      <template #media>${mediaTop}</template>
      <h3 class="font-heading text-lg font-bold">With media</h3>
      <p class="mt-2 text-base text-fg-muted">A full-width media area sits above the content.</p>
    </Card>
  `,
})
