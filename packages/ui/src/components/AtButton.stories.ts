import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Button from './AtButton.vue'

// A minimal inline icon for the slot stories. data-testid mirrors the slot used,
// for readability in the rendered DOM.
const Star = (testid: string) =>
  `<svg data-testid="${testid}" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z"/></svg>`

const intents = ['primary', 'secondary', 'neutral', 'danger', 'success', 'warning', 'info'] as const
const variants = ['default', 'flat'] as const
const sizes = ['sm', 'md', 'lg'] as const

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
    loading: { control: 'boolean' },
  },
  args: { intent: 'primary', variant: 'default', size: 'md', disabled: false, loading: false },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: '<Button v-bind="args">Button</Button>',
  }),
}

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
    `,
  }),
}

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
    `,
  }),
}

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
    `,
  }),
}

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
    `,
  }),
}

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
    `,
  }),
}

// Loading defaults to a circle-notch spinner. The first button supplies its own
// #left icon to prove the spinner overrides it while loading; the second has no
// left icon to prove the spinner still appears.
export const Loading: Story = {
  args: { loading: true },
  render: (args) => ({
    components: { Button },
    setup: () => ({ args, icon: Star('left-icon') }),
    template: `
      <div class="flex items-center gap-4">
        <Button v-bind="args">
          <template #left><span v-html="icon" /></template>Saving
        </Button>
        <Button v-bind="args">Saving</Button>
      </div>
    `,
  }),
}

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
    `,
  }),
}

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
    `,
  }),
}

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => ({
    components: { Button },
    setup: () => ({ args, variants }),
    template: `
      <div class="flex items-center gap-4">
        <Button v-for="variant in variants" :key="variant" v-bind="args" :variant="variant">Disabled</Button>
      </div>
    `,
  }),
}

const states = [
  { name: 'Resting', props: {} },
  { name: 'Disabled', props: { disabled: true } },
  { name: 'Loading', props: { loading: true } },
] as const

// The visual board: every axis on one screen in a labelled grid, so a single
// screenshot covers the whole component. Colours (intent x variant) up top; then
// the size x variant x icon matrix across resting/disabled/loading; then the same
// matrix for icon-only. This is the story the snapshot test snaps.
export const Snapshot: Story = {
  render: () => ({
    components: { Button },
    setup: () => ({ intents, variants, sizes, states, icon: Star('snap-icon') }),
    template: `
      <div class="flex w-max flex-col gap-10 bg-bg-default p-6" data-testid="snap-board">
        <section class="flex flex-col gap-3">
          <h2 class="font-heading font-bold text-fg-default text-lg">Colours</h2>
          <div class="grid grid-cols-[6rem_repeat(7,auto)] items-center gap-3">
            <span></span>
            <span v-for="intent in intents" :key="intent" class="font-body text-fg-subtle text-sm capitalize">{{ intent }}</span>
          </div>
          <div
            v-for="variant in variants"
            :key="variant"
            class="grid grid-cols-[6rem_repeat(7,auto)] items-center gap-3"
          >
            <span class="font-body text-fg-muted text-sm capitalize">{{ variant }}</span>
            <div v-for="intent in intents" :key="intent">
              <Button :intent="intent" :variant="variant">{{ intent }}</Button>
            </div>
          </div>
        </section>

        <section class="flex flex-col gap-4">
          <h2 class="font-heading font-bold text-fg-default text-lg">Sizes, icons & states</h2>
          <div v-for="state in states" :key="state.name" class="flex flex-col gap-3">
            <h3 class="font-body font-bold text-fg-muted text-sm">{{ state.name }}</h3>
            <div class="grid w-fit grid-cols-[3rem_repeat(2,auto_auto)] items-center justify-items-start gap-x-4 gap-y-3">
              <span></span>
              <span
                v-for="variant in variants"
                :key="variant"
                class="col-span-2 font-body text-fg-subtle text-xs capitalize"
              >{{ variant }}</span>
              <template v-for="size in sizes" :key="size">
                <span class="font-body text-fg-subtle text-xs">{{ size }}</span>
                <template v-for="variant in variants" :key="variant">
                  <Button :variant="variant" :size="size" v-bind="state.props">Label</Button>
                  <Button :variant="variant" :size="size" v-bind="state.props">
                    <template #left><span v-html="icon" /></template>Label
                  </Button>
                </template>
              </template>
            </div>
          </div>
        </section>

        <section class="flex flex-col gap-4">
          <h2 class="font-heading font-bold text-fg-default text-lg">Icon only</h2>
          <div class="flex flex-row gap-8">
            <div v-for="state in states" :key="state.name" class="flex flex-col gap-3">
              <h3 class="font-body font-bold text-fg-muted text-sm">{{ state.name }}</h3>
              <div class="grid w-fit grid-cols-[3rem_repeat(2,auto)] items-center justify-items-start gap-x-4 gap-y-3">
                <span></span>
                <span
                  v-for="variant in variants"
                  :key="variant"
                  class="font-body text-fg-subtle text-xs capitalize"
                >{{ variant }}</span>
                <template v-for="size in sizes" :key="size">
                  <span class="font-body text-fg-subtle text-xs">{{ size }}</span>
                  <Button
                    v-for="variant in variants"
                    :key="variant"
                    :variant="variant"
                    :size="size"
                    v-bind="state.props"
                    aria-label="Favourite"
                  >
                    <template #left><span v-html="icon" /></template>
                  </Button>
                </template>
              </div>
            </div>
          </div>
        </section>
      </div>
    `,
  }),
}
