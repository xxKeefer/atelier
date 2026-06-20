import type { Preview } from '@storybook/vue3-vite';
import '../src/styles.css';

const preview: Preview = {
  parameters: {
    backgrounds: { disable: true }
  },
  decorators: [
    (story) => ({
      components: { story },
      template:
        '<div style="background: var(--color-bg-canvas); color: var(--color-fg-default); font-family: var(--font-body); padding: var(--spacing-8); min-height: 100vh;"><story /></div>'
    })
  ]
};

export default preview;
