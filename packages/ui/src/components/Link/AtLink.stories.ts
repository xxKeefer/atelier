import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Link from './AtLink.vue'

// A minimal inline icon for the slot stories. data-testid mirrors the slot used,
// for readability in the rendered DOM.
const Arrow = (testid: string) =>
  `<svg data-testid="${testid}" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`

const intents = [
  'inherit',
  'primary',
  'secondary',
  'neutral',
  'danger',
  'success',
  'warning',
  'info',
] as const

const meta = {
  title: 'Navigation/Link',
  component: Link,
  // Fail the Vitest run on any axe violation, not just warn.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    intent: { control: 'select', options: intents },
    disabled: { control: 'boolean' },
  },
  args: { intent: 'inherit', href: 'https://example.com', disabled: false },
} satisfies Meta<typeof Link>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => ({
    components: { Link },
    setup: () => ({ args }),
    template: '<Link v-bind="args">Visit site</Link>',
  }),
}

// Every intent on the canvas, axe-checked. inherit picks up this row's own
// text colour rather than painting its own.
export const Colors: Story = {
  render: () => ({
    components: { Link },
    setup: () => ({ intents }),
    template: `
      <div class="flex flex-col gap-2">
        <p v-for="intent in intents" :key="intent" class="font-body text-fg-default text-sm capitalize">
          {{ intent }}: <Link :intent="intent" href="https://example.com">Visit site</Link>
        </p>
      </div>
    `,
  }),
}

// The link inherits the paragraph's own typography (size, weight) instead of
// imposing its own -- there is no font-* utility on the component.
export const FontInheritance: Story = {
  render: () => ({
    components: { Link },
    setup: () => ({}),
    template: `
      <div class="flex flex-col gap-3 font-body text-fg-default">
        <p class="text-sm">Small body copy with a <Link href="https://example.com">plain inline link</Link> in the middle.</p>
        <p class="text-lg font-bold">Large bold copy with a <Link href="https://example.com">matching bold link</Link> too.</p>
      </div>
    `,
  }),
}

// A long label wraps like ordinary text -- the root has no inline-flex/
// inline-block, so it never holds itself together as one unbreakable box.
export const Multiline: Story = {
  render: () => ({
    components: { Link },
    setup: () => ({ icon: Arrow('multiline-icon') }),
    template: `
      <p class="max-w-xs font-body text-fg-default text-sm">
        Read the
        <Link href="https://example.com">
          full changelog for this release, including every breaking change and migration note
          <template #right><span v-html="icon" /></template>
        </Link>
        before you upgrade.
      </p>
    `,
  }),
}

export const LeftIcon: Story = {
  render: (args) => ({
    components: { Link },
    setup: () => ({ args, icon: Arrow('left-icon') }),
    template: `
      <Link v-bind="args">
        <template #left><span v-html="icon" /></template>Back to overview
      </Link>
    `,
  }),
}

export const RightIcon: Story = {
  render: (args) => ({
    components: { Link },
    setup: () => ({ args, icon: Arrow('right-icon') }),
    template: `
      <Link v-bind="args">
        Continue reading<template #right><span v-html="icon" /></template>
      </Link>
    `,
  }),
}

// href resolves the element to an anchor (role=link); dropping it resolves to
// a button (role=button) instead, the same resolution AtButton uses.
export const AsButton: Story = {
  args: { href: undefined },
  render: (args) => ({
    components: { Link },
    setup: () => ({ args }),
    template: '<Link v-bind="args">Trigger action</Link>',
  }),
}

// A disabled link is inert: aria-disabled announces it, the href is dropped
// so it isn't navigable, and pointer-events-none blocks the cursor.
export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => ({
    components: { Link },
    setup: () => ({ args }),
    template: '<Link v-bind="args">Visit site</Link>',
  }),
}

const states = [
  { name: 'Resting', props: {} },
  { name: 'Disabled', props: { disabled: true } },
] as const

// The visual board: every intent, both icon slots, and every state on one
// screen. This is the story the snapshot test snaps.
export const Snapshot: Story = {
  render: () => ({
    components: { Link },
    setup: () => ({ intents, states, icon: Arrow('snap-icon') }),
    template: `
      <div class="flex w-max flex-col gap-8 bg-bg-default p-6" data-testid="snap-board">
        <section class="flex flex-col gap-3">
          <h2 class="font-heading font-bold text-fg-default text-lg">Colours</h2>
          <p v-for="intent in intents" :key="intent" class="font-body text-fg-default text-sm capitalize">
            {{ intent }}: <Link :intent="intent" href="https://example.com">Visit site</Link>
          </p>
        </section>

        <section class="flex flex-col gap-3">
          <h2 class="font-heading font-bold text-fg-default text-lg">Icons &amp; states</h2>
          <div v-for="state in states" :key="state.name" class="flex flex-col gap-2">
            <h3 class="font-body font-bold text-fg-muted text-sm">{{ state.name }}</h3>
            <div class="flex items-center gap-6 font-body text-fg-default text-sm">
              <Link href="https://example.com" v-bind="state.props">Plain link</Link>
              <Link href="https://example.com" v-bind="state.props">
                <template #left><span v-html="icon" /></template>Left icon
              </Link>
              <Link href="https://example.com" v-bind="state.props">
                Right icon<template #right><span v-html="icon" /></template>
              </Link>
            </div>
          </div>
        </section>

        <section class="flex flex-col gap-3">
          <h2 class="font-heading font-bold text-fg-default text-lg">In paragraph text</h2>
          <p class="max-w-xs font-body text-fg-default text-sm">
            Read the
            <Link href="https://example.com">
              full changelog for this release, including every breaking change
            </Link>
            before you upgrade.
          </p>
        </section>
      </div>
    `,
  }),
}
