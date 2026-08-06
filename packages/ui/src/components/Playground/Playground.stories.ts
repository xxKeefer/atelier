import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ProductPageView } from './ProductPageView'
import { ControlPanelView } from './ControlPanelView'

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
// (2nd criterion of the Token Playground epic). Inputs are locally reactive
// only so far -- live CSS-var override wiring onto ProductPageView is the
// next slice.
export const ControlPanel: Story = {
  render: () => ({ components: { ControlPanelView }, template: `<ControlPanelView />` }),
}

// Both halves side by side, previewing the eventual playground layout even
// though edits don't cross over to the page yet.
export const ProductPageWithControls: Story = {
  render: () => ({
    components: { ProductPageView, ControlPanelView },
    template: `
      <div class="flex items-start gap-4">
        <ProductPageView />
        <ControlPanelView />
      </div>
    `,
  }),
}
