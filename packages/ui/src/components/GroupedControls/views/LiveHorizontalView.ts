import { defineComponent } from 'vue'
import { liveHorizontalSegments } from '../data'

// The horizontal gang under real interaction: real <button>s riding
// :hover/:active, mirroring AtButton's neutral mechanic. Border-drop is not
// purely structural here -- see `seam` in data.ts for the elevation-aware
// peer/peer-hover rule. `relative focus-visible:z-10` lifts a focused
// segment above its following sibling so the focus ring isn't clipped.
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
          class="relative flex h-14 w-20 flex-col items-center justify-center border-[3px] border-solid border-border-strong bg-surface-strong font-body font-bold text-sm cursor-pointer shadow-higher -translate-y-lift-full transition-[filter] transition-press hover:enabled:shadow-high hover:enabled:-translate-y-lift-half hover:enabled:brightness-[1.08] active:enabled:shadow-low active:enabled:translate-y-0 active:enabled:brightness-95 disabled:cursor-not-allowed disabled:shadow-flat disabled:translate-y-0 disabled:opacity-50 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus"
          :class="[s.position, s.seam]"
        >
          {{ s.label }}
        </button>
      </div>
    </div>
  `,
})
