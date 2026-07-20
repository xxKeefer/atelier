import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { defineComponent } from 'vue'
import Accordion from './AtAccordion.vue'
import AccordionItem from './AtAccordionItem.vue'

const types = ['single', 'multiple'] as const

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  // Fail the Vitest run on any axe violation, not just warn.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    type: { control: 'select', options: types },
    collapsible: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: { type: 'single', collapsible: true, disabled: false },
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => ({
    components: { Accordion, AccordionItem },
    setup: () => ({ args }),
    template: `
      <Accordion v-bind="args">
        <AccordionItem value="a" label="What is Atelier?">
          A personal design system and Vue component library.
        </AccordionItem>
        <AccordionItem value="b" label="Which primitives does it build on?">
          Reka-ui owns the accessibility contract; Atelier styles it via tokens.
        </AccordionItem>
        <AccordionItem value="c" label="Can content include other components?">
          Yes -- the content area accepts any slot content, including other
          Atelier components.
        </AccordionItem>
      </Accordion>
    `,
  }),
}

// type="multiple" lets several items stay open at once, each toggling independently.
export const Multiple: Story = {
  args: { type: 'multiple' },
  render: (args) => ({
    components: { Accordion, AccordionItem },
    setup: () => ({ args }),
    template: `
      <Accordion v-bind="args" :modelValue="['a', 'b']">
        <AccordionItem value="a" label="First section">Open by default.</AccordionItem>
        <AccordionItem value="b" label="Second section">Also open by default.</AccordionItem>
        <AccordionItem value="c" label="Third section">Closed by default.</AccordionItem>
      </Accordion>
    `,
  }),
}

// A per-item disabled prop takes an item out of interaction while its
// siblings stay operable -- the accordion-level `disabled` prop above
// disables every item at once via reka-ui's group context.
export const DisabledItem: Story = {
  render: () => ({
    components: { Accordion, AccordionItem },
    template: `
      <Accordion type="single">
        <AccordionItem value="a" label="Available section">Open me.</AccordionItem>
        <AccordionItem value="b" label="Unavailable section" disabled>
          Not reachable while disabled.
        </AccordionItem>
      </Accordion>
    `,
  }),
}

// The #trigger slot swaps the plain text label for richer header content --
// content composition isn't limited to the body.
export const CustomTrigger: Story = {
  render: () => ({
    components: { Accordion, AccordionItem },
    template: `
      <Accordion type="single">
        <AccordionItem value="a">
          <template #trigger>
            <span class="flex items-center gap-2">
              <span class="inline-flex h-2 w-2 rounded-full bg-success-solid"></span>
              Status: Operational
            </span>
          </template>
          All systems are running normally.
        </AccordionItem>
      </Accordion>
    `,
  }),
}

// The visual board: closed/open single-type stack, a multiple-type stack with
// two items open, and a disabled item -- one screen, one screenshot.
const SnapshotView = defineComponent({
  components: { Accordion, AccordionItem },
  template: `
    <div class="flex w-max flex-col gap-8 bg-bg-default p-6" data-testid="snap-board">
      <section class="flex w-96 flex-col gap-3">
        <h2 class="font-heading text-lg font-bold text-fg-default">Single, one open</h2>
        <Accordion type="single" modelValue="a">
          <AccordionItem value="a" label="First section">Open content.</AccordionItem>
          <AccordionItem value="b" label="Second section">Closed content.</AccordionItem>
          <AccordionItem value="c" label="Third section">Closed content.</AccordionItem>
        </Accordion>
      </section>

      <section class="flex w-96 flex-col gap-3">
        <h2 class="font-heading text-lg font-bold text-fg-default">Multiple, two open</h2>
        <Accordion type="multiple" :modelValue="['a', 'b']">
          <AccordionItem value="a" label="First section">Open content.</AccordionItem>
          <AccordionItem value="b" label="Second section">Also open.</AccordionItem>
          <AccordionItem value="c" label="Third section">Closed content.</AccordionItem>
        </Accordion>
      </section>

      <section class="flex w-96 flex-col gap-3">
        <h2 class="font-heading text-lg font-bold text-fg-default">Disabled item</h2>
        <Accordion type="single">
          <AccordionItem value="a" label="Available section">Open me.</AccordionItem>
          <AccordionItem value="b" label="Unavailable section" disabled>Unreachable.</AccordionItem>
        </Accordion>
      </section>
    </div>
  `,
})

export const Snapshot: Story = {
  render: () => ({ components: { SnapshotView }, template: `<SnapshotView />` }),
}
