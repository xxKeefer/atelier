import { defineComponent } from 'vue'
import { liveHorizontalSegments } from '../data'

// The horizontal gang under real interaction: real <button> elements riding
// :hover/:active pseudo-state, mirroring AtButton's neutral rest/hover/active
// mechanic (shadow-higher/high/low + lift translate + brightness) instead of
// each segment being pinned to a fixed rung. The border-seam layout
// (rounded-l-md on REW, border-l-0 cascading right, rounded-r-md on STOP) is
// unchanged from the static ladder -- it's structural, not state-dependent.
export const LiveHorizontalView = defineComponent({
  setup: () => ({ liveHorizontalSegments }),
  template: `
    <div class="flex w-max flex-col gap-3 text-fg-default">
      <span class="font-body text-fg-subtle text-xs">horizontal gang -- live interaction</span>
      <div class="flex items-stretch">
        <button
          v-for="s in liveHorizontalSegments"
          :key="s.label"
          type="button"
          :disabled="s.disabled"
          class="flex h-14 w-20 flex-col items-center justify-center border-[3px] border-solid border-border-strong bg-surface-strong font-body font-bold text-sm cursor-pointer shadow-higher -translate-y-lift-full transition-[filter] duration-[120ms] ease-[ease] motion-reduce:transition-none hover:enabled:shadow-high hover:enabled:-translate-y-lift-half hover:enabled:brightness-[1.08] active:enabled:shadow-low active:enabled:translate-y-0 active:enabled:brightness-95 disabled:cursor-not-allowed disabled:shadow-flat disabled:translate-y-0 disabled:opacity-50"
          :class="s.position"
        >
          {{ s.label }}
        </button>
      </div>
    </div>
  `,
})
