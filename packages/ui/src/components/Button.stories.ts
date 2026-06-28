import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, within } from 'storybook/test';
import Button from './Button.vue';

// A minimal inline icon for the slot stories. data-testid lets the play fns
// assert presence and DOM order relative to the label.
const Star = (testid: string) =>
  `<svg data-testid="${testid}" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z"/></svg>`;

const intents = ['primary', 'secondary', 'neutral', 'danger', 'success', 'warning', 'info'] as const;
const variants = ['default', 'flat'] as const;
const sizes = ['sm', 'md', 'lg'] as const;

const meta = {
  title: 'Components/Button',
  component: Button,
  // Fail the Vitest run on any axe violation, not just warn.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    intent: { control: 'select', options: intents },
    variant: { control: 'select', options: variants },
    size: { control: 'select', options: sizes },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' }
  },
  args: { intent: 'primary', variant: 'default', size: 'md', disabled: false, loading: false }
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: '<Button v-bind="args">Button</Button>'
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button')).toHaveTextContent('Button');
  }
};

// The review story: every intent x variant rendered on the canvas, axe-checked.
export const AllColors: Story = {
  render: () => ({
    components: { Button },
    setup: () => ({ intents, variants }),
    template: `
      <div class="flex flex-col gap-3">
        <div class="grid grid-cols-[6rem_repeat(2,minmax(0,1fr))] items-center gap-3">
          <span></span>
          <span v-for="v in variants" :key="v" class="font-body text-fg-subtle text-sm capitalize">{{ v }}</span>
        </div>
        <div
          v-for="intent in intents"
          :key="intent"
          class="grid grid-cols-[6rem_repeat(2,minmax(0,1fr))] items-center gap-3"
        >
          <span class="font-body text-fg-muted text-sm capitalize">{{ intent }}</span>
          <div v-for="variant in variants" :key="variant">
            <Button :intent="intent" :variant="variant">{{ intent }}</Button>
          </div>
        </div>
      </div>
    `
  })
};

export const Sizes: Story = {
  render: () => ({
    components: { Button },
    setup: () => ({ sizes, variants }),
    template: `
      <div class="flex flex-col gap-4">
        <div v-for="variant in variants" :key="variant" class="flex items-center gap-4">
          <Button v-for="size in sizes" :key="size" :size="size" :variant="variant">{{ size }}</Button>
        </div>
      </div>
    `
  })
};

export const LeftIcon: Story = {
  render: (args) => ({
    components: { Button },
    setup: () => ({ args, variants, icon: Star('left-icon') }),
    template: `
      <div class="flex items-center gap-4">
        <Button v-for="variant in variants" :key="variant" v-bind="args" :variant="variant">
          <template #left><span v-html="icon" /></template>Save
        </Button>
      </div>
    `
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getAllByRole('button').forEach((button) => {
      const icon = within(button).getByTestId('left-icon');
      expect(button).toHaveTextContent('Save');
      // Left icon precedes the label: it is the button's first element child.
      expect(button.firstElementChild).toBe(icon.closest('span'));
    });
  }
};

export const RightIcon: Story = {
  render: (args) => ({
    components: { Button },
    setup: () => ({ args, variants, icon: Star('right-icon') }),
    template: `
      <div class="flex items-center gap-4">
        <Button v-for="variant in variants" :key="variant" v-bind="args" :variant="variant">
          Next<template #right><span v-html="icon" /></template>
        </Button>
      </div>
    `
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getAllByRole('button').forEach((button) => {
      const icon = within(button).getByTestId('right-icon');
      expect(button).toHaveTextContent('Next');
      // Right icon follows the label: it is the button's last element child.
      expect(button.lastElementChild).toBe(icon.closest('span'));
    });
  }
};

export const IconOnly: Story = {
  render: (args) => ({
    components: { Button },
    setup: () => ({ args, variants, icon: Star('only-icon') }),
    template: `
      <div class="flex items-center gap-4">
        <Button v-for="variant in variants" :key="variant" v-bind="args" :variant="variant" aria-label="Add to favourites">
          <template #left><span v-html="icon" /></template>
        </Button>
      </div>
    `
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // With no text label, the accessible name comes from aria-label.
    canvas.getAllByRole('button', { name: 'Add to favourites' }).forEach((button) => {
      expect(within(button).getByTestId('only-icon')).toBeInTheDocument();
      expect(button).toHaveTextContent('');
    });
  }
};

export const Loading: Story = {
  args: { loading: true },
  render: (args) => ({
    components: { Button },
    setup: () => ({ args, variants, icon: Star('spinner') }),
    template: `
      <div class="flex items-center gap-4">
        <Button v-for="variant in variants" :key="variant" v-bind="args" :variant="variant">
          <template #left><span v-html="icon" /></template>Saving
        </Button>
      </div>
    `
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getAllByRole('button').forEach((button) => {
      // loading implies disabled: the button is inert.
      expect(button).toBeDisabled();
      // The spinner is whatever the consumer passes into #left; while loading
      // its wrapper carries the spin animation.
      const spinner = within(button).getByTestId('spinner');
      expect(spinner.closest('.animate-spin')).not.toBeNull();
    });
  }
};

// href resolves the element to an anchor (role=link) instead of a button.
export const LinkButton: Story = {
  args: { href: 'https://example.com' },
  render: (args) => ({
    components: { Button },
    setup: () => ({ args, variants }),
    template: `
      <div class="flex items-center gap-4">
        <Button v-for="variant in variants" :key="variant" v-bind="args" :variant="variant">Visit site</Button>
      </div>
    `
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const links = canvas.getAllByRole('link', { name: 'Visit site' });
    links.forEach((link) => {
      expect(link).toHaveAttribute('href', 'https://example.com');
      // Link buttons always open in a new tab, guarded against tabnabbing.
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  }
};

// A disabled link is inert: aria-disabled marks it, the href is dropped so it
// isn't navigable, and pointer-events-none blocks the cursor. No native disabled
// attribute exists on an anchor.
export const DisabledLink: Story = {
  args: { href: 'https://example.com', disabled: true },
  render: (args) => ({
    components: { Button },
    setup: () => ({ args, variants }),
    template: `
      <div class="flex items-center gap-4">
        <Button v-for="variant in variants" :key="variant" v-bind="args" :variant="variant">Visit site</Button>
      </div>
    `
  }),
  play: async ({ canvasElement }) => {
    // Dropping the href strips the link role on purpose -- the anchor is inert,
    // so query the elements directly rather than by role.
    const anchors = canvasElement.querySelectorAll('a');
    expect(anchors).toHaveLength(variants.length);
    anchors.forEach((anchor) => {
      expect(anchor).toHaveTextContent('Visit site');
      expect(anchor).toHaveAttribute('aria-disabled', 'true');
      expect(anchor).not.toHaveAttribute('href');
      expect(anchor.className).toContain('pointer-events-none');
    });
  }
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => ({
    components: { Button },
    setup: () => ({ args, variants }),
    template: `
      <div class="flex items-center gap-4">
        <Button v-for="variant in variants" :key="variant" v-bind="args" :variant="variant">Disabled</Button>
      </div>
    `
  })
};
