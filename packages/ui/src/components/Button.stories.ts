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
    disabled: { control: 'boolean' }
  },
  args: { intent: 'primary', variant: 'default', size: 'md', disabled: false }
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
    setup: () => ({ sizes }),
    template: `
      <div class="flex items-center gap-4">
        <Button v-for="size in sizes" :key="size" :size="size">{{ size }}</Button>
      </div>
    `
  })
};

export const LeftIcon: Story = {
  render: (args) => ({
    components: { Button },
    setup: () => ({ args, icon: Star('left-icon') }),
    template: `<Button v-bind="args"><template #left><span v-html="icon" /></template>Save</Button>`
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    const icon = canvas.getByTestId('left-icon');
    await expect(button).toHaveTextContent('Save');
    await expect(button).toContainElement(icon);
    // Left icon precedes the label: it is the button's first element child.
    await expect(button.firstElementChild).toBe(icon.closest('span'));
  }
};

export const RightIcon: Story = {
  render: (args) => ({
    components: { Button },
    setup: () => ({ args, icon: Star('right-icon') }),
    template: `<Button v-bind="args">Next<template #right><span v-html="icon" /></template></Button>`
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    const icon = canvas.getByTestId('right-icon');
    await expect(button).toHaveTextContent('Next');
    await expect(button).toContainElement(icon);
    // Right icon follows the label: it is the button's last element child.
    await expect(button.lastElementChild).toBe(icon.closest('span'));
  }
};

export const IconOnly: Story = {
  render: (args) => ({
    components: { Button },
    setup: () => ({ args, icon: Star('only-icon') }),
    template: `<Button v-bind="args" aria-label="Add to favourites"><template #left><span v-html="icon" /></template></Button>`
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // With no text label, the accessible name comes from aria-label.
    const button = canvas.getByRole('button', { name: 'Add to favourites' });
    await expect(button).toContainElement(canvas.getByTestId('only-icon'));
    await expect(button).toHaveTextContent('');
  }
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: '<Button v-bind="args">Disabled</Button>'
  })
};
