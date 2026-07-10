import { defineComponent } from 'vue'
import Card from '../AtCard.vue'

// Body only: the simplest card -- a bordered surface holding arbitrary content.
export const BasicView = defineComponent({
  components: { Card },
  template: `
    <Card class="w-80">
      <h3 class="font-heading text-lg font-bold">Card title</h3>
      <p class="mt-2 text-base text-fg-muted">Supporting copy describing the subject this card groups.</p>
    </Card>
  `,
})
