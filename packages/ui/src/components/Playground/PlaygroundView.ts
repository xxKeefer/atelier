import { computed, defineComponent } from 'vue'
import { ProductPageView } from './ProductPageView'
import { ControlPanelView } from './ControlPanelView'
import { useTokenOverrides } from './useTokenOverrides'

// Wires the control panel's overrides onto a wrapper around ProductPageView
// as CSS custom-property overrides -- Vue's :style object binding writes
// arbitrary custom properties directly onto the element's inline style, so
// they take precedence over the tokens.css values ProductPageView's classes
// resolve against, live, with no rebuild.
export const PlaygroundView = defineComponent({
  components: { ProductPageView, ControlPanelView },
  setup: () => {
    const { overrides, setFromPicker } = useTokenOverrides()
    const overrideStyle = computed(() => ({ ...overrides }))
    return { overrides, setFromPicker, overrideStyle }
  },
  template: `
    <div class="flex items-start gap-4">
      <div :style="overrideStyle" data-testid="playground-wrapper">
        <ProductPageView />
      </div>
      <ControlPanelView :overrides="overrides" :set-from-picker="setFromPicker" />
    </div>
  `,
})
