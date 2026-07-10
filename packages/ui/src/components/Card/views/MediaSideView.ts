import { defineComponent } from 'vue'
import Card from '../AtCard.vue'

// A stand-in media block: a flat coloured panel standing in for an image so the
// stories carry no asset dependency. Fixed-width on the side.
const mediaSide = `<div class="w-32 bg-secondary-default"></div>`

// Media flush to one side of the content column.
export const MediaSideView = defineComponent({
  components: { Card },
  template: `
    <Card class="w-96" media-position="left">
      <template #media>${mediaSide}</template>
      <h3 class="font-heading text-lg font-bold">Side media</h3>
      <p class="mt-2 text-base text-fg-muted">The media sits beside the content instead of above it.</p>
    </Card>
  `,
})
