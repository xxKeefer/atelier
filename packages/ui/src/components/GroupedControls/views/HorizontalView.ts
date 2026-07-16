import { defineComponent } from 'vue'
import { horizontalSegments } from '../data'

// The horizontal gang: a row of individually extruded keycaps sitting flush
// edge to edge -- zero gap, square inner joins, rounded only at the run's
// outer-left and outer-right ends. Each segment is pinned to a different rung
// of the button ladder (rest/hover/active/disabled) so the whole state range
// reads in one static row.
export const HorizontalView = defineComponent({
  setup: () => ({ horizontalSegments }),
  template: `
    <div class="flex w-max flex-col gap-3 text-fg-default">
      <span class="font-body text-fg-subtle text-xs">horizontal gang -- button-group shape</span>
      <div class="flex items-stretch">
        <div
          v-for="s in horizontalSegments"
          :key="s.label"
          class="flex h-14 w-20 flex-col items-center justify-center gap-1 border-[3px] border-solid font-body font-bold text-sm"
          :class="[s.class, s.position]"
        >
          <span>{{ s.label }}</span>
          <span class="font-mono text-[10px] text-fg-muted">{{ s.state }}</span>
        </div>
      </div>
    </div>
  `,
})
