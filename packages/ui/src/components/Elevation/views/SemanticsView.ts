import { defineComponent } from 'vue'
import { colourways, liftFor } from '../data'

// One row per semantic colourway: its surface ramp beside its (fully coloured)
// shadow ladder.
export const SemanticsView = defineComponent({
  setup: () => ({ colourways, liftFor }),
  template: `
    <div class="flex w-max flex-col gap-6 text-fg-default">
      <p class="max-w-prose font-body text-fg-muted text-sm">
        Each colourway mirrors the neutral ladder, hue-matched: lower / low / flat share
        one plane and a dimmer lit rim; high / higher rise to the brighter solid fill and
        a brighter lit rim. Both rims sit one step lighter than their fill, exactly as the
        neutral row does. Rung names are read off the neutral row above; the columns align.
      </p>
      <div v-for="cw in colourways" :key="cw.name" class="flex items-start gap-10">
        <span class="w-20 shrink-0 self-center font-mono text-sm">{{ cw.name }}</span>
        <div class="flex flex-col gap-2">
          <span class="font-body text-fg-subtle text-xs">surface ramp</span>
          <div class="flex items-end gap-3">
            <div v-for="t in cw.ramp" :key="t.label" class="flex flex-col items-center gap-2">
              <div class="h-14 w-14 rounded-md border border-border-default" :class="t.class"></div>
              <span class="font-body text-fg-subtle text-xs">{{ t.label }}</span>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <span class="font-body text-fg-subtle text-xs">shadow ladder</span>
          <div class="flex items-end gap-3">
            <div v-for="r in cw.ladder" :key="r.name" class="flex flex-col items-center gap-2">
              <div class="grid h-14 w-20 place-items-center rounded-md border" :class="[r.surface || cw.surface, r.border, r.class, liftFor(r.name)]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
