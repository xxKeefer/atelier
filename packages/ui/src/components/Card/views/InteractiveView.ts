import { defineComponent } from 'vue'
import Card from '../AtCard.vue'

// The whole card is one tappable action: an anchor with the lift/press
// affordance. No nested links or buttons in this shape.
export const InteractiveView = defineComponent({
  components: { Card },
  template: `
    <Card href="https://example.com" class="w-80">
      <h3 class="font-heading text-lg font-bold">Tappable card</h3>
      <p class="mt-2 text-base text-fg-muted">The entire card navigates on click.</p>
    </Card>
  `,
})
