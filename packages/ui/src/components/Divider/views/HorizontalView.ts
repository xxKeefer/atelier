import { defineComponent } from 'vue'
import Divider from '../AtDivider.vue'

// Horizontal: a full-width rule parting stacked content.
export const HorizontalView = defineComponent({
  components: { Divider },
  template: `
    <div class="flex w-64 flex-col gap-4 text-fg-default">
      <p class="font-body text-base">First block of content.</p>
      <Divider />
      <p class="font-body text-base">Second block of content.</p>
    </div>
  `,
})
