import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, within } from 'storybook/test';
import { PhHeart, PhStar, PhWarningCircle } from '@phosphor-icons/vue';
import Icon from './Icon.vue';

const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;
const weights = ['regular', 'fill'] as const;

const meta = {
  title: 'Components/Icon',
  component: Icon,
  // Fail the Vitest run on any axe violation, not just warn.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    size: { control: 'select', options: sizes },
    weight: { control: 'select', options: weights },
    color: { control: 'text' },
    label: { control: 'text' }
  },
  args: { icon: PhHeart, size: 'md', weight: 'regular' }
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => ({
    components: { Icon },
    setup: () => ({ args }),
    template: '<Icon v-bind="args" />'
  })
};

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
    `
  })
};

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
    `
  })
};

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
    `
  })
};

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
    `
  }),
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector('svg')!;
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    // No img role exists, so the icon contributes nothing to the a11y tree.
    expect(within(canvasElement).queryByRole('img')).toBeNull();
  }
};

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
    `
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole('img', { name: 'Favourite' })).toBeInTheDocument();
  }
};

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
    `
  })
};
