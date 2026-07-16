import { defineComponent } from 'vue'
import { liveVerticalSegments } from '../data'

// The vertical gang under real interaction: real <button> elements riding
// :hover pseudo-state -- shadow-flat at rest, inset shadow-low paired with a
// bg-surface-subtle tone shift on hover (shadow alone doesn't read here, see
// the "Vertical depression" finding in data.ts). Only background-color
// transitions; box-shadow can't tween (non-interpolable), so it snaps.
export const LiveVerticalView = defineComponent({
  setup: () => ({ liveVerticalSegments }),
  template: `
    <div class="flex w-max flex-col gap-3 text-fg-default">
      <span class="font-body text-fg-subtle text-xs">vertical gang -- live interaction</span>
      <div class="flex w-40 flex-col">
        <button
          v-for="s in liveVerticalSegments"
          :key="s.label"
          type="button"
          class="flex items-center border-[3px] border-solid border-border-default bg-surface-default px-4 py-2 text-left font-body text-sm cursor-pointer shadow-flat transition-colors duration-[120ms] ease-[ease] motion-reduce:transition-none hover:bg-surface-subtle hover:shadow-low"
          :class="s.position"
        >
          {{ s.label }}
        </button>
      </div>
    </div>
  `,
})
