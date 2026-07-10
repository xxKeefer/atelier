import { defineComponent } from 'vue'
import { surfaces, shadows, liftFor } from '../data'

// The neutral foundation, in the same row layout as the semantics: the surface
// ramp beside the shadow ladder. Borders are tiered by rung in every colourway:
// the recesses (lower / low) take a subtle border, the resting and lifted
// rungs (flat / high / higher) a strong one. The neutral lifts also climb the
// surface ramp -- high / higher sit on the strong plane (700).
export const NeutralView = defineComponent({
  setup: () => ({ surfaces, shadows, liftFor }),
  template: `
    <div class="flex w-max flex-col gap-6 text-fg-default">
      <p class="max-w-prose font-body text-fg-muted text-sm">
        Borders are tiered by rung: the recesses and resting rung (lower / low /
        flat) take a lighter border, only the lifts (high / higher) a strong one --
        in each colourway's own border hue. The neutral lifts also rise up the surface
        ramp: high and higher sit on the strong plane (700).
      </p>
      <div class="flex items-start gap-10">
        <span class="w-20 shrink-0 self-center font-mono text-sm">neutral</span>
        <div class="flex flex-col gap-2">
          <span class="font-body text-fg-subtle text-xs">surface ramp</span>
          <div class="flex items-end gap-3">
            <div v-for="s in surfaces" :key="s.name" class="flex flex-col items-center gap-2">
              <div class="h-14 w-14 rounded-md border border-border-default" :class="s.class"></div>
              <span class="font-body text-fg-subtle text-xs">{{ s.name }}</span>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <span class="font-body text-fg-subtle text-xs">shadow ladder</span>
          <div class="flex items-end gap-3">
            <div v-for="s in shadows" :key="s.name" class="flex flex-col items-center gap-2">
              <div class="grid h-14 w-20 place-items-center rounded-md border" :class="[s.surface, s.border, s.shadow, liftFor(s.name)]">
                <span class="font-mono text-xs">{{ s.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
