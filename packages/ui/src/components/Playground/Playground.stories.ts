import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ProductPageView } from './ProductPageView'
import { ControlPanelView } from './ControlPanelView'
import { PlaygroundView } from './PlaygroundView'
import { useTokenOverrides } from './useTokenOverrides'

// The token playground has no component of its own -- like Colour and
// Elevation, it's a foundation-layer story that exercises real @atelier/ui
// components rather than shipping a new one. This first story is the static
// mock product page (phase 1 of the Token Playground epic); later phases add
// a control panel that overrides the semantic token CSS vars live on top of
// this same page.
const meta = {
  title: 'Foundations/Token Playground',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const ProductPage: Story = {
  render: () => ({ components: { ProductPageView }, template: `<ProductPageView />` }),
}

// Control panel generated from color-semantic.json, one control per token
// (2nd criterion of the Token Playground epic). Standalone here with its own
// overrides instance -- nothing to apply them to in this story.
export const ControlPanel: Story = {
  render: () => ({
    components: { ControlPanelView },
    setup: () => useTokenOverrides(),
    template: `<ControlPanelView :overrides="overrides" :set-from-picker="setFromPicker" />`,
  }),
}

// Page and panel sharing one overrides instance -- edits apply live as CSS
// custom-property overrides on the wrapper around ProductPageView (3rd
// criterion of the Token Playground epic).
export const ProductPageWithControls: Story = {
  render: () => ({ components: { PlaygroundView }, template: `<PlaygroundView />` }),
}
