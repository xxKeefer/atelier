import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { colourways, shadeNames } from './data'

// The colour model has no component -- like Elevation, it's a token-layer
// foundation. This story renders the tier-1 palette itself: every colourway as a
// row, every shade (50-950) as a column, so the raw ramp can be eyeballed and snapped.
const meta = {
  title: 'Foundations/Colour',
  parameters: { a11y: { test: 'error' } },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Primitives: Story = {
  render: () => ({
    setup: () => ({ colourways, shadeNames }),
    template: `
      <div class="flex w-max flex-col gap-3 text-fg-default">
        <div class="flex items-center gap-3 pl-20">
          <span v-for="shade in shadeNames" :key="shade" class="w-12 text-center font-mono text-fg-subtle text-xs">{{ shade }}</span>
        </div>
        <div v-for="way in colourways" :key="way.name" class="flex items-center gap-3">
          <span class="w-20 shrink-0 font-mono text-sm">{{ way.name }}</span>
          <div
            v-for="s in way.shades"
            :key="s.shade"
            class="h-12 w-12 rounded-md border border-border-default"
            :style="{ backgroundColor: s.value }"
          ></div>
        </div>
      </div>
    `,
  }),
}
