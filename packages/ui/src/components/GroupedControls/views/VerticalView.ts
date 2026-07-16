import { defineComponent } from 'vue'
import { verticalSegments } from '../data'

// The vertical gang: a stack of select-option-shaped segments, flush top to
// bottom -- zero gap, square inner joins, rounded only at the stack's
// outer-top and outer-bottom ends. One segment is pinned to the
// hover-depressed look (inset shadow-low) to prove the depression stays
// contained within its own segment instead of bleeding onto its neighbours.
export const VerticalView = defineComponent({
  setup: () => ({ verticalSegments }),
  template: `
    <div class="flex w-max flex-col gap-3 text-fg-default">
      <span class="font-body text-fg-subtle text-xs">vertical gang -- select-option-list shape</span>
      <div class="flex w-40 flex-col">
        <div
          v-for="s in verticalSegments"
          :key="s.label"
          class="flex items-center justify-between border-[3px] border-solid px-4 py-2 font-body text-sm"
          :class="[s.class, s.position]"
        >
          <span>{{ s.label }}</span>
          <span class="font-mono text-[10px] text-fg-muted">{{ s.state }}</span>
        </div>
      </div>
    </div>
  `,
})
