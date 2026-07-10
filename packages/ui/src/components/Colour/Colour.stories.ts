import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PhInfo } from '@phosphor-icons/vue'
import Icon from '../Icon/AtIcon.vue'
import {
  brandColumnLabels,
  brands,
  colourways,
  iconsAndText,
  shadeNames,
  statusColumnLabels,
  statuses,
} from './data'

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

// Tier-2 semantic statuses: every status as a row, every surface/edge/text token
// as a column. Fill tokens (bg, solid, surface-*) swatch as filled boxes; border
// tokens (border, border-*, edge) swatch as outline-only boxes so the rim itself is
// what's demonstrated; fg/on-solid swatch as sample text (on-solid over its solid fill).
export const Status: Story = {
  render: () => ({
    setup: () => ({ statuses, statusColumnLabels }),
    template: `
      <div class="flex w-max flex-col gap-3 text-fg-default">
        <div class="flex items-center gap-3 pl-24">
          <span v-for="label in statusColumnLabels" :key="label" class="w-24 text-center font-mono text-fg-subtle text-xs">{{ label }}</span>
        </div>
        <div v-for="status in statuses" :key="status.name" class="flex items-center gap-3">
          <span class="w-24 shrink-0 font-mono text-sm">{{ status.name }}</span>
          <div
            v-for="col in status.columns"
            :key="col.label"
            class="flex h-12 w-24 items-center justify-center rounded-md"
            :class="col.kind === 'text' ? col.class : col.kind === 'border' ? ['bg-transparent border-2', col.class] : ['border border-border-default', col.class]"
          >
            <span v-if="col.kind === 'text'" class="text-xs">Aa</span>
          </div>
        </div>
      </div>
    `,
  }),
}

// The three brand rows: primary, secondary, neutral, columned by surface ramp +
// border tiers + edge + fg. Neutral has no edge token (no lit fill to shadow), so
// that cell renders empty rather than a fake substitute -- see data.ts for why.
export const Brand: Story = {
  render: () => ({
    setup: () => ({ brands, brandColumnLabels }),
    template: `
      <div class="flex w-max flex-col gap-3 text-fg-default">
        <div class="flex items-center gap-3 pl-24">
          <span v-for="label in brandColumnLabels" :key="label" class="w-24 text-center font-mono text-fg-subtle text-xs">{{ label }}</span>
        </div>
        <div v-for="brand in brands" :key="brand.name" class="flex items-center gap-3">
          <span class="w-24 shrink-0 font-mono text-sm">{{ brand.name }}</span>
          <div
            v-for="col in brand.columns"
            :key="col.label"
            class="flex h-12 w-24 items-center justify-center rounded-md"
            :class="col.kind === 'none' ? '' : col.kind === 'text' ? col.class : col.kind === 'border' ? ['bg-transparent border-2', col.class] : ['border border-border-default', col.class]"
          >
            <span v-if="col.kind === 'text'" class="text-xs">Aa</span>
          </div>
        </div>
      </div>
    `,
  }),
}

// Icon/text usage examples: an icon and a text sample coloured to match the
// surface underneath, using only the fg/on-solid pairings already validated
// (contrast.test.ts) by the Status/Brand stories above.
export const IconsAndText: Story = {
  render: () => ({
    components: { Icon },
    setup: () => ({ iconsAndText, icon: PhInfo }),
    template: `
      <div class="flex w-max flex-col gap-3">
        <div
          v-for="row in iconsAndText"
          :key="row.name"
          class="flex items-center gap-3 rounded-md p-3"
          :class="[row.bg, row.tone]"
        >
          <Icon :icon="icon" size="lg" />
          <span class="font-body text-sm">{{ row.name }}</span>
        </div>
      </div>
    `,
  }),
}
