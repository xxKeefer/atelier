import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, within } from 'storybook/test';
import Button from './Button.vue';

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

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: '<Button v-bind="args">Disabled</Button>'
  })
};
