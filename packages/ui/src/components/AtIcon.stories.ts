import type { Meta, StoryObj } from '@storybook/vue3-vite'
import {
  PhArrowLeft,
  PhArrowRight,
  PhArrowSquareOut,
  PhBackspace,
  PhCaretDown,
  PhCheckSquare,
  PhCircleNotch,
  PhCopy,
  PhHeart,
  PhInfo,
  PhMagnifyingGlass,
  PhMinus,
  PhPlus,
  PhStar,
  PhWarning,
  PhWarningCircle,
  PhWarningDiamond,
  PhX,
} from '@phosphor-icons/vue'
import Icon from './AtIcon.vue'

const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const
const weights = ['regular', 'fill'] as const

const meta = {
  title: 'Components/Icon',
  component: Icon,
  // Fail the Vitest run on any axe violation, not just warn.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    size: { control: 'select', options: sizes },
    weight: { control: 'select', options: weights },
    color: { control: 'text' },
    label: { control: 'text' },
  },
  args: { icon: PhHeart, size: 'md', weight: 'regular' },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => ({
    components: { Icon },
    setup: () => ({ args }),
    template: '<Icon v-bind="args" />',
  }),
}

// One glyph at every named size -- each maps to a type-scale step so icons line
// up with the text they sit beside.
export const Sizes: Story = {
  render: () => ({
    components: { Icon },
    setup: () => ({ sizes, icon: PhStar }),
    template: `
      <div class="flex items-end gap-4 text-fg-default">
        <div v-for="size in sizes" :key="size" class="flex flex-col items-center gap-1">
          <Icon :icon="icon" :size="size" />
          <span class="font-body text-fg-subtle text-xs">{{ size }}</span>
        </div>
      </div>
    `,
  }),
}

// Regular vs fill -- the two weights Atelier ships.
export const Weights: Story = {
  render: () => ({
    components: { Icon },
    setup: () => ({ weights, icon: PhHeart }),
    template: `
      <div class="flex items-center gap-6 text-fg-default">
        <div v-for="weight in weights" :key="weight" class="flex flex-col items-center gap-1">
          <Icon :icon="icon" :weight="weight" size="2xl" />
          <span class="font-body text-fg-subtle text-xs">{{ weight }}</span>
        </div>
      </div>
    `,
  }),
}

// Colour by token, and colour inherited from the parent. The first row paints
// the glyph with a status-colour token; the second inherits the parent's text
// colour (no color prop).
export const Colors: Story = {
  render: () => ({
    components: { Icon },
    setup: () => ({ icon: PhWarningCircle }),
    template: `
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-4">
          <Icon :icon="icon" size="xl" color="var(--color-status-danger-solid)" />
          <Icon :icon="icon" size="xl" color="var(--color-status-warning-solid)" />
          <Icon :icon="icon" size="xl" color="var(--color-status-success-solid)" />
          <Icon :icon="icon" size="xl" color="var(--color-status-info-solid)" />
        </div>
        <div class="flex items-center gap-2 text-brand-secondary-default">
          <Icon :icon="icon" size="xl" />
          <span class="font-body text-base">inherits the parent's colour</span>
        </div>
      </div>
    `,
  }),
}

// Decorative by default: hidden from the a11y tree, no accessible name.
export const Decorative: Story = {
  render: (args) => ({
    components: { Icon },
    setup: () => ({ args }),
    template: `
      <div class="flex items-center gap-2 text-fg-default">
        <Icon v-bind="args" />
        <span class="font-body text-base">no label: hidden from screen readers (aria-hidden)</span>
      </div>
    `,
  }),
}

// A label promotes the icon to a meaningful img with that accessible name.
export const Labeled: Story = {
  args: { label: 'Favourite', icon: PhHeart },
  render: (args) => ({
    components: { Icon },
    setup: () => ({ args }),
    template: `
      <div class="flex items-center gap-2 text-fg-default">
        <Icon v-bind="args" />
        <span class="font-body text-base">with a label: announced as an img named "{{ args.label }}"</span>
      </div>
    `,
  }),
}

// The semantic convention: glyphs that carry a fixed meaning across Atelier, so a
// warning is always the same warning. Regular weight unless a row says otherwise.
// This story is the documentation -- the source of truth other components defer to.
const semantic = {
  Status: [
    {
      icon: PhCheckSquare,
      name: 'Success',
      note: 'success status',
      tone: 'text-status-success-solid',
    },
    { icon: PhInfo, name: 'Info', note: 'informational status', tone: 'text-status-info-solid' },
    {
      icon: PhWarning,
      name: 'Warning',
      note: 'warning status',
      tone: 'text-status-warning-solid',
    },
    {
      icon: PhWarningDiamond,
      name: 'Error',
      note: 'error / danger status',
      tone: 'text-status-danger-solid',
    },
  ],
  Navigation: [
    { icon: PhArrowRight, name: 'Next / Forward', note: 'stepper / wizard navigation', tone: '' },
    { icon: PhArrowLeft, name: 'Back / Previous', note: 'stepper / wizard navigation', tone: '' },
    { icon: PhArrowSquareOut, name: 'External link', note: 'opens away from the app', tone: '' },
  ],
  Actions: [
    { icon: PhMagnifyingGlass, name: 'Search', note: '', tone: '' },
    { icon: PhPlus, name: 'Increment', note: '', tone: '' },
    { icon: PhMinus, name: 'Decrement', note: '', tone: '' },
    { icon: PhX, name: 'Cancel / Close', note: 'remove a draft item, close a modal', tone: '' },
    { icon: PhBackspace, name: 'Delete', note: 'destructive, no undo', tone: '' },
    { icon: PhCopy, name: 'Copy', note: '', tone: '' },
  ],
} as const

export const Semantic: Story = {
  render: () => ({
    components: { Icon },
    setup: () => ({
      semantic,
      groups: Object.keys(semantic) as (keyof typeof semantic)[],
      caret: PhCaretDown,
      spinner: PhCircleNotch,
    }),
    template: `
      <div class="flex w-max flex-col gap-8 bg-bg-default p-6 text-fg-default">
        <section v-for="group in groups" :key="group" class="flex flex-col gap-3">
          <h2 class="font-heading font-bold text-lg">{{ group }}</h2>
          <div class="flex flex-col gap-3">
            <div v-for="row in semantic[group]" :key="row.name" class="flex items-center gap-3">
              <Icon :icon="row.icon" size="xl" :class="row.tone" />
              <span class="font-body w-40 text-base">{{ row.name }}</span>
              <span class="font-body text-fg-subtle text-sm">{{ row.note }}</span>
            </div>
          </div>
        </section>

        <section class="flex flex-col gap-3">
          <h2 class="font-heading font-bold text-lg">Loading</h2>
          <div class="flex items-center gap-3">
            <Icon :icon="spinner" size="xl" class="animate-spin" />
            <span class="font-body w-40 text-base">Loading</span>
            <span class="font-body text-fg-subtle text-sm">never static, always spinning</span>
          </div>
        </section>

        <section class="flex flex-col gap-3">
          <h2 class="font-heading font-bold text-lg">Disclosure</h2>
          <p class="font-body max-w-prose text-fg-subtle text-sm">
            One glyph, fill weight, rotated by CSS to point where the panel goes:
            down for a select (a menu sits below), up for a closing accordion, left
            and right for drawers. The icon never changes -- only its rotation.
          </p>
          <div class="flex items-center gap-6">
            <div class="flex flex-col items-center gap-1">
              <Icon :icon="caret" weight="fill" size="xl" />
              <span class="font-body text-fg-subtle text-xs">expand (select)</span>
            </div>
            <div class="flex flex-col items-center gap-1">
              <Icon :icon="caret" weight="fill" size="xl" class="rotate-180" />
              <span class="font-body text-fg-subtle text-xs">contract</span>
            </div>
            <div class="flex flex-col items-center gap-1">
              <Icon :icon="caret" weight="fill" size="xl" class="-rotate-90" />
              <span class="font-body text-fg-subtle text-xs">drawer (left)</span>
            </div>
            <div class="flex flex-col items-center gap-1">
              <Icon :icon="caret" weight="fill" size="xl" class="rotate-90" />
              <span class="font-body text-fg-subtle text-xs">drawer (right)</span>
            </div>
          </div>
        </section>
      </div>
    `,
  }),
}

// The visual board: sizes, weights, and colour on one screen in a labelled grid.
// This is the story the snapshot test snaps.
export const Snapshot: Story = {
  render: () => ({
    components: { Icon },
    setup: () => ({ sizes, weights, star: PhStar, heart: PhHeart, warning: PhWarningCircle }),
    template: `
      <div class="flex w-max flex-col gap-8 bg-bg-default p-6 text-fg-default" data-testid="snap-board">
        <section class="flex flex-col gap-2">
          <h2 class="font-heading font-bold text-lg">Sizes</h2>
          <div class="flex items-end gap-4">
            <div v-for="size in sizes" :key="size" class="flex flex-col items-center gap-1">
              <Icon :icon="star" :size="size" />
              <span class="font-body text-fg-subtle text-xs">{{ size }}</span>
            </div>
          </div>
        </section>
        <section class="flex flex-col gap-2">
          <h2 class="font-heading font-bold text-lg">Weights</h2>
          <div class="flex items-center gap-6">
            <div v-for="weight in weights" :key="weight" class="flex flex-col items-center gap-1">
              <Icon :icon="heart" :weight="weight" size="2xl" />
              <span class="font-body text-fg-subtle text-xs">{{ weight }}</span>
            </div>
          </div>
        </section>
        <section class="flex flex-col gap-2">
          <h2 class="font-heading font-bold text-lg">Colours</h2>
          <div class="flex items-center gap-4">
            <Icon :icon="warning" size="xl" color="var(--color-status-danger-solid)" />
            <Icon :icon="warning" size="xl" color="var(--color-status-warning-solid)" />
            <Icon :icon="warning" size="xl" color="var(--color-status-success-solid)" />
            <Icon :icon="warning" size="xl" color="var(--color-status-info-solid)" />
            <span class="flex items-center gap-2 text-brand-secondary-default">
              <Icon :icon="warning" size="xl" />
              <span class="font-body text-base">inherits parent colour</span>
            </span>
          </div>
        </section>
      </div>
    `,
  }),
}
