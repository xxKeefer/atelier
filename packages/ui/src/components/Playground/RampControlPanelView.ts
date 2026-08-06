import { defineComponent, ref, type PropType } from 'vue'
import Button from '../Button/AtButton.vue'
import { buildPaletteJson, paletteFamilies } from './paletteList'
import type { useRampOverrides } from './useRampOverrides'

// Ramp-level controls: one section per hue family with lightness/chroma/hue
// sliders that reshape all 11 steps at once (phase 2 of the Token Playground
// epic), plus a swatch strip so the shifted ramp is checked at a glance. Native
// <input type=range>, matching ControlPanelView's native <input type=color> --
// no AtSlider exists in this library yet and one isn't warranted for a
// playground-only control.
export const RampControlPanelView = defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names -- registering the imported AtButton component, not defining one named that
  components: { Button },
  props: {
    transforms: {
      type: Object as PropType<ReturnType<typeof useRampOverrides>['transforms']>,
      required: true,
    },
    paletteOverrides: {
      type: Object as PropType<ReturnType<typeof useRampOverrides>['paletteOverrides']>,
      required: true,
    },
    setTransform: {
      type: Function as PropType<ReturnType<typeof useRampOverrides>['setTransform']>,
      required: true,
    },
    resetFamily: {
      type: Function as PropType<ReturnType<typeof useRampOverrides>['resetFamily']>,
      required: true,
    },
  },
  setup: (props) => {
    // String `template:` (vs. an SFC <template> block) compiles expressions
    // with the plain JS parser, not the TS-aware one -- a `foo as Bar` cast
    // inline in the template is a runtime SyntaxError, not just a lint
    // nitpick. Cast in a real .ts function instead and call that.
    function sliderValue(event: Event): number {
      return Number((event.target as HTMLInputElement).value)
    }
    // "Copied!" is a timed label swap, not persistent state -- a plain ref is
    // enough, no need to route it through useRampOverrides.
    const copied = ref(false)
    async function exportJson() {
      const json = buildPaletteJson({ ...props.paletteOverrides })
      await navigator.clipboard.writeText(JSON.stringify(json, null, 2))
      copied.value = true
      setTimeout(() => (copied.value = false), 1500)
    }
    return { families: paletteFamilies, sliderValue, copied, exportJson }
  },
  template: `
    <div class="flex w-80 flex-col gap-2 bg-surface-default p-4 font-body text-fg-default" data-testid="ramp-control-panel">
      <div class="flex items-center justify-between gap-2">
        <h2 class="font-heading text-base font-bold text-fg-default">Palette ramps</h2>
        <Button size="sm" variant="flat" data-testid="export-palette-json" @click="exportJson">
          {{ copied ? 'Copied!' : 'Export JSON' }}
        </Button>
      </div>
      <p class="text-xs text-fg-subtle">Lightness, chroma, and hue-shift controls per hue family.</p>

      <details v-for="group in families" :key="group.family" class="rounded-md border border-border-default" open>
        <summary class="flex cursor-pointer select-none items-center justify-between px-3 py-2 text-sm font-bold text-fg-default">
          <span>{{ group.family }}</span>
          <Button size="sm" variant="flat" :data-testid="'reset-' + group.family" @click.prevent="resetFamily(group.family)">
            Reset
          </Button>
        </summary>
        <div class="flex flex-col gap-3 border-t border-border-subtle p-3">
          <div class="flex gap-1" :data-testid="'swatches-' + group.family">
            <span
              v-for="entry in group.entries"
              :key="entry.cssVar"
              class="h-6 flex-1 rounded-sm"
              :style="{ backgroundColor: paletteOverrides[entry.cssVar] }"
              :title="entry.step + ': ' + paletteOverrides[entry.cssVar]"
            />
          </div>

          <label class="flex flex-col gap-1 text-xs">
            <span class="flex justify-between">
              <span class="font-bold text-fg-default">Lightness</span>
              <span class="text-fg-subtle">{{ transforms[group.family].lightness.toFixed(2) }}</span>
            </span>
            <input
              type="range"
              min="-0.3"
              max="0.3"
              step="0.01"
              :value="transforms[group.family].lightness"
              @input="setTransform(group.family, { lightness: sliderValue($event) })"
              :aria-label="group.family + ' lightness'"
            />
          </label>

          <label class="flex flex-col gap-1 text-xs">
            <span class="flex justify-between">
              <span class="font-bold text-fg-default">Chroma</span>
              <span class="text-fg-subtle">{{ transforms[group.family].chroma.toFixed(2) }}</span>
            </span>
            <input
              type="range"
              min="0"
              max="2"
              step="0.05"
              :value="transforms[group.family].chroma"
              @input="setTransform(group.family, { chroma: sliderValue($event) })"
              :aria-label="group.family + ' chroma'"
            />
          </label>

          <label class="flex flex-col gap-1 text-xs">
            <span class="flex justify-between">
              <span class="font-bold text-fg-default">Hue shift</span>
              <span class="text-fg-subtle">{{ transforms[group.family].hue.toFixed(0) }}&deg;</span>
            </span>
            <input
              type="range"
              min="-180"
              max="180"
              step="1"
              :value="transforms[group.family].hue"
              @input="setTransform(group.family, { hue: sliderValue($event) })"
              :aria-label="group.family + ' hue shift'"
            />
          </label>
        </div>
      </details>
    </div>
  `,
})
