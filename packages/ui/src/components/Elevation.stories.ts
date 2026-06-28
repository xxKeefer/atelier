import type { Meta, StoryObj } from '@storybook/vue3-vite'

// The elevation model has no component -- it's a token-layer foundation. These
// stories render the two families that compose skeuomorphic depth so they can be
// eyeballed and snapped: the shadow ladder and the surface ramp.

// The symmetric shadow ladder, hard-edged (no blur). Below default = a solid
// inset band at the top recessing to the subtle tone (lower); above = a solid
// neutral-border block dropped below (higher). default is flat. Each maps to a
// shadow-* utility off the token of the same name.
// surface is the plane each rung is shown on -- all sit on the default plane;
// the recesses step down to subtle, the lifts read against the canvas.
const shadows = [
  {
    name: 'sunk',
    shadow: 'shadow-sunk',
    surface: 'bg-surface-default',
    note: 'lowest -- recessed, inset',
  },
  {
    name: 'half-sunk',
    shadow: 'shadow-half-sunk',
    surface: 'bg-surface-default',
    note: 'lower -- shallow recess',
  },
  {
    name: 'default',
    shadow: 'shadow-default',
    surface: 'bg-surface-default',
    note: 'flat -- no elevation',
  },
  {
    name: 'half-pop',
    shadow: 'shadow-half-pop',
    surface: 'bg-surface-default',
    note: 'higher -- gentle lift',
  },
  {
    name: 'pop',
    shadow: 'shadow-pop',
    surface: 'bg-surface-default',
    note: 'highest -- hard bottom edge',
  },
] as const

// The surface ramp: the three background steps depth pairs with. subtle (950) is
// also the page floor; strong (800) is the most lifted plane.
const surfaces = [
  { name: 'subtle', class: 'bg-surface-subtle', note: '950 -- page floor' },
  { name: 'default', class: 'bg-surface-default', note: '900 -- resting plane' },
  { name: 'strong', class: 'bg-surface-strong', note: '800 -- lifted plane' },
] as const

const meta = {
  title: 'Foundations/Elevation',
  // No backing component -- fail the Vitest run on any axe violation regardless.
  parameters: { a11y: { test: 'error' } },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// The shadow ladder: five tiles on the resting surface, each carrying one rung.
// The inset rungs recess to the subtle tone within the tile; the lifted rungs
// drop their hard block against the canvas behind them.
export const ShadowLadder: Story = {
  render: () => ({
    setup: () => ({ shadows }),
    template: `
      <div class="flex w-max items-end gap-6 text-fg-default">
        <div v-for="s in shadows" :key="s.name" class="flex flex-col items-center gap-3">
          <div class="grid h-24 w-32 place-items-center rounded-lg border border-border-default" :class="[s.shadow, s.surface]">
            <span class="font-mono text-sm">{{ s.name }}</span>
          </div>
          <span class="font-body text-fg-subtle text-xs">{{ s.note }}</span>
        </div>
      </div>
    `,
  }),
}

// The surface ramp: the three background planes side by side, each labelled.
export const SurfaceRamp: Story = {
  render: () => ({
    setup: () => ({ surfaces }),
    template: `
      <div class="flex w-max gap-6 text-fg-default">
        <div v-for="s in surfaces" :key="s.name" class="flex flex-col items-center gap-3">
          <div class="grid h-24 w-32 place-items-center rounded-lg border border-border-default" :class="s.class">
            <span class="font-mono text-sm">{{ s.name }}</span>
          </div>
          <span class="font-body text-fg-subtle text-xs">{{ s.note }}</span>
        </div>
      </div>
    `,
  }),
}

// The visual board: the full ladder above the full ramp on one screen. This is
// the story the snapshot test snaps.
export const Snapshot: Story = {
  render: () => ({
    setup: () => ({ shadows, surfaces }),
    template: `
      <div class="flex w-max flex-col gap-8 bg-bg-default p-6 text-fg-default" data-testid="snap-board">
        <section class="flex flex-col gap-3">
          <h2 class="font-heading font-bold text-lg">Shadow ladder</h2>
          <div class="flex w-max items-end gap-6">
            <div v-for="s in shadows" :key="s.name" class="flex flex-col items-center gap-3">
              <div class="grid h-24 w-32 place-items-center rounded-lg border border-border-default" :class="[s.shadow, s.surface]">
                <span class="font-mono text-sm">{{ s.name }}</span>
              </div>
              <span class="font-body text-fg-subtle text-xs">{{ s.note }}</span>
            </div>
          </div>
        </section>
        <section class="flex flex-col gap-3">
          <h2 class="font-heading font-bold text-lg">Surface ramp</h2>
          <div class="flex w-max gap-6">
            <div v-for="s in surfaces" :key="s.name" class="flex flex-col items-center gap-3">
              <div class="grid h-24 w-32 place-items-center rounded-lg border border-border-default" :class="s.class">
                <span class="font-mono text-sm">{{ s.name }}</span>
              </div>
              <span class="font-body text-fg-subtle text-xs">{{ s.note }}</span>
            </div>
          </div>
        </section>
      </div>
    `,
  }),
}
