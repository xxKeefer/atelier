import { computed, defineComponent } from 'vue'
import { ProductPageView } from './ProductPageView'
import { ControlPanelView } from './ControlPanelView'
import { RampControlPanelView } from './RampControlPanelView'
import { useRampOverrides } from './useRampOverrides'

// Phase 2 of the Token Playground epic: ramp-level palette controls layered
// on phase 1's semantic control panel. useRampOverrides() wraps
// useTokenOverrides() so both panels read/write one overrides map -- a ramp
// transform recomputes a family's palette steps AND every --color-* var
// aliasing them, so ControlPanelView's own swatches move too, same as
// PlaygroundView's wrapper does for the product page.
export const RampPlaygroundView = defineComponent({
  components: { ProductPageView, ControlPanelView, RampControlPanelView },
  setup: () => {
    const {
      transforms,
      paletteOverrides,
      colorOverrides,
      setFromPicker,
      setTransform,
      resetFamily,
    } = useRampOverrides()
    const overrideStyle = computed(() => ({ ...paletteOverrides, ...colorOverrides }))
    return {
      transforms,
      paletteOverrides,
      colorOverrides,
      setFromPicker,
      setTransform,
      resetFamily,
      overrideStyle,
    }
  },
  template: `
    <div class="flex items-start gap-4">
      <div :style="overrideStyle" data-testid="ramp-playground-wrapper">
        <ProductPageView />
      </div>
      <ControlPanelView :overrides="colorOverrides" :set-from-picker="setFromPicker" />
      <RampControlPanelView
        :transforms="transforms"
        :palette-overrides="paletteOverrides"
        :set-transform="setTransform"
        :reset-family="resetFamily"
      />
    </div>
  `,
})
