import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ThemeProof from './ThemeProof.vue';

const meta = {
  title: 'Foundations/ThemeProof',
  component: ThemeProof,
  argTypes: {
    heading: { control: 'text' }
  }
} satisfies Meta<typeof ThemeProof>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomHeading: Story = {
  args: { heading: 'Lavender Haze' }
};
