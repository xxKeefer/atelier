import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { defineComponent } from 'vue'
import Textarea from './AtTextarea.vue'

const sizes = ['sm', 'md', 'lg'] as const

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  // Fail the Vitest run on any axe violation, not just warn.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    label: { control: 'text' },
    help: { control: 'text' },
    error: { control: 'text' },
    placeholder: { control: 'text' },
    size: { control: 'select', options: sizes },
  },
  args: { size: 'md' },
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: { label: 'Label', placeholder: 'Type here' },
  render: (args) => ({
    components: { Textarea },
    setup: () => ({ args }),
    template: '<Textarea v-bind="args" class="w-80" />',
  }),
}

// A labelled field: the label sits above on the surface; clicking it focuses
// the recessed textarea.
export const WithLabel: Story = {
  render: () => ({
    components: { Textarea },
    template: '<Textarea label="Bio" placeholder="Tell us about yourself" class="w-80" />',
  }),
}

// Help text reserves a fixed line below the field, on the normal surface.
export const WithHelp: Story = {
  render: () => ({
    components: { Textarea },
    template: `
      <Textarea
        label="Bio"
        placeholder="Tell us about yourself"
        help="Max 200 characters."
        class="w-80"
      />
    `,
  }),
}

// Error text takes the message line's place, coloured danger. It occupies the
// same reserved space as help -- toggling between them never shifts the
// layout.
export const WithError: Story = {
  render: () => ({
    components: { Textarea },
    template: `
      <Textarea
        label="Bio"
        placeholder="Tell us about yourself"
        error="Bio is required."
        class="w-80"
      />
    `,
  }),
}

// Disabled: half-depth recess (a shallower bucket), dimmed, not-allowed
// cursor. The field goes inert via the native disabled attribute -- no value
// submits.
export const Disabled: Story = {
  render: () => ({
    components: { Textarea },
    template: '<Textarea label="Bio" placeholder="Tell us about yourself" disabled class="w-80" />',
  }),
}

// A bare field: no label, help, or error. It stays vertically compact (no
// reserved message line). The accessible name comes from a forwarded
// aria-label.
export const Bare: Story = {
  render: () => ({
    components: { Textarea },
    template: '<Textarea aria-label="Comments" placeholder="Comments…" class="w-64" />',
  }),
}

// Shared view fragment. Authored once here and reused by both the standalone
// story and the Snapshot board, so the snapped image can never drift from the
// live story.
const SizesView = defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names -- registering the real Textarea component, not defining one named "Textarea"
  components: { Textarea },
  setup: () => ({ sizes }),
  template: `
    <div class="flex items-start gap-6">
      <Textarea
        v-for="size in sizes"
        :key="size"
        :size="size"
        :label="size"
        :placeholder="'Size ' + size"
        class="w-64"
      />
    </div>
  `,
})

export const Sizes: Story = {
  render: () => ({ components: { SizesView }, template: `<SizesView />` }),
}

// The visual board: every shape in a wrapping grid that fills the available
// width and flows onto further rows. This is the story the snapshot test
// snaps. Baseline: __snaps__/textarea-chromium-linux.png.
export const Snapshot: Story = {
  render: () => ({
    components: { Textarea, SizesView },
    template: `
      <div class="flex w-[960px] flex-col gap-8 bg-bg-default p-6" data-testid="snap-board">
        <section class="flex flex-col gap-4">
          <h2 class="font-heading text-lg font-bold text-fg-default">States</h2>
          <div class="flex flex-wrap items-start gap-6">
            <Textarea label="Bio" placeholder="Tell us about yourself" class="w-72" />
            <Textarea label="Bio" placeholder="Tell us about yourself" help="Max 200 characters." class="w-72" />
            <Textarea label="Bio" placeholder="Tell us about yourself" error="Bio is required." class="w-72" />
            <Textarea aria-label="Comments" placeholder="Comments…" class="w-48" />
            <Textarea label="Bio" placeholder="Tell us about yourself" disabled class="w-72" />
          </div>
        </section>

        <section class="flex flex-col gap-4">
          <h2 class="font-heading text-lg font-bold text-fg-default">Sizes</h2>
          <SizesView />
        </section>
      </div>
    `,
  }),
}
