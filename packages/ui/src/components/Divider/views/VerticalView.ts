import { defineComponent } from 'vue'
import Divider from '../AtDivider.vue'

// Vertical: a self-stretching rule between inline items. The flex parent supplies
// the height the rule stretches to.
export const VerticalView = defineComponent({
  components: { Divider },
  template: `
    <div class="flex h-8 items-center gap-4 text-fg-default">
      <span class="font-body text-base">Home</span>
      <Divider orientation="vertical" />
      <span class="font-body text-base">Docs</span>
      <Divider orientation="vertical" />
      <span class="font-body text-base">About</span>
    </div>
  `,
})
