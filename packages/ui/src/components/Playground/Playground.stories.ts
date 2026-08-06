import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ProductPageView } from './ProductPageView'

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
