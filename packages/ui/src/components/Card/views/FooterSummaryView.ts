import { defineComponent } from 'vue'
import Card from '../AtCard.vue'

// A footer carrying a summary instead of actions -- the slot is flexible enough
// for either, or both.
export const FooterSummaryView = defineComponent({
  components: { Card },
  template: `
    <Card class="w-80">
      <h3 class="font-heading text-lg font-bold">Invoice #1024</h3>
      <p class="mt-2 text-base text-fg-muted">3 line items.</p>
      <template #footer>
        <span class="text-sm text-fg-subtle">Updated today</span>
        <span class="font-bold">$420.00</span>
      </template>
    </Card>
  `,
})
