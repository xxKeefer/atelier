import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, within } from 'storybook/test';
import ThemeProof from './ThemeProof.vue';

const meta = {
  title: 'Foundations/ThemeProof',
  component: ThemeProof,
  // Fail the Vitest run on any axe violation, not just warn.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    heading: { control: 'text' }
  }
} satisfies Meta<typeof ThemeProof>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1 })).toHaveTextContent('Atelier');
  }
};

export const CustomHeading: Story = {
  args: { heading: 'Lavender Haze' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1 })).toHaveTextContent('Lavender Haze');
  }
};
