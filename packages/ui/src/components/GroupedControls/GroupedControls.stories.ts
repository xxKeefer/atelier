import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { HorizontalView } from './views/HorizontalView'
import { VerticalView } from './views/VerticalView'

// GroupedControls has no backing component -- it's a token-layer foundation,
// proving the "gang" rule (zero gap, square inner joins, outer-ends-only
// rounding, border-as-seam) already implemented ad hoc in AtInput/AtSelect's
// icon/prefix/field/suffix row, generalized to the two shapes Button Groups
// and Select's option list need: a horizontal run of extruded segments and a
// vertical run of recessed ones. Mirrors Elevation/Colour's component-less
// pattern.
const meta = {
  title: 'Foundations/GroupedControls',
  parameters: { a11y: { test: 'error' } },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// The horizontal gang: button-group shape, keycap segments across the
// rest/hover/active/disabled ladder.
export const Horizontal: Story = {
  render: () => ({
    components: { HorizontalView },
    template: `<HorizontalView />`,
  }),
}

// The vertical gang: select-option-list shape, one segment pinned to its
// hover-depressed look.
export const Vertical: Story = {
  render: () => ({
    components: { VerticalView },
    template: `<VerticalView />`,
  }),
}

// The visual board: both gangs on one screen, from the same shared views as
// their standalone stories. This is the story the snapshot test snaps.
export const Snapshot: Story = {
  render: () => ({
    components: { HorizontalView, VerticalView },
    template: `
      <div class="flex w-max flex-col gap-8 bg-bg-default p-6 text-fg-default" data-testid="snap-board">
        <HorizontalView />
        <VerticalView />
      </div>
    `,
  }),
}
