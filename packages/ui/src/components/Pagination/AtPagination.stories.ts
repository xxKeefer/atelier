import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { defineComponent, ref } from 'vue'
import Pagination from './AtPagination.vue'

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  // Fail the Vitest run on any axe violation, not just warn.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    modelValue: { control: 'number' },
    totalPages: { control: 'number' },
    siblingCount: { control: 'number' },
    boundaryCount: { control: 'number' },
    hasNextPage: { control: 'boolean' },
    pageSize: { control: 'number' },
    pageSizeOptions: { control: 'object' },
  },
  args: {
    modelValue: 5,
    totalPages: 20,
    siblingCount: 1,
    boundaryCount: 1,
    pageSize: 10,
    pageSizeOptions: [10, 25, 50, 100],
  },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

// A stateful wrapper: the playground needs modelValue/pageSize to actually
// update on click, which a plain args-bound story can't do (args are static
// per render).
export const Playground: Story = {
  render: (args) => ({
    components: { Pagination },
    setup: () => {
      const page = ref(args.modelValue)
      const pageSize = ref(args.pageSize)
      return { args, page, pageSize }
    },
    template: `<Pagination v-bind="args" v-model="page" v-model:page-size="pageSize" />`,
  }),
}

// No window needed: every page fits, so no ellipsis renders.
export const FewPages: Story = {
  args: { modelValue: 2, totalPages: 4 },
  render: (args) => ({
    components: { Pagination },
    setup: () => ({ args }),
    template: `<Pagination v-bind="args" />`,
  }),
}

// Near the start: only a right-hand ellipsis appears.
export const StartOfRange: Story = {
  args: { modelValue: 1, totalPages: 20 },
  render: (args) => ({
    components: { Pagination },
    setup: () => ({ args }),
    template: `<Pagination v-bind="args" />`,
  }),
}

// Comfortably in the middle: ellipsis on both sides.
export const MiddleOfRange: Story = {
  args: { modelValue: 10, totalPages: 20 },
  render: (args) => ({
    components: { Pagination },
    setup: () => ({ args }),
    template: `<Pagination v-bind="args" />`,
  }),
}

// Near the end: only a left-hand ellipsis appears, next is disabled.
export const EndOfRange: Story = {
  args: { modelValue: 20, totalPages: 20 },
  render: (args) => ({
    components: { Pagination },
    setup: () => ({ args }),
    template: `<Pagination v-bind="args" />`,
  }),
}

// A wider sibling/boundary count widens the window before an ellipsis kicks in.
export const WiderWindow: Story = {
  args: { modelValue: 10, totalPages: 20, siblingCount: 2, boundaryCount: 2 },
  render: (args) => ({
    components: { Pagination },
    setup: () => ({ args }),
    template: `<Pagination v-bind="args" />`,
  }),
}

// When the total page count is unknown ahead of time (e.g. a stream of
// results with no count), omit totalPages -- the component drops the
// numbered window entirely and navigates one page at a time.
export const IndeterminateTotal: Story = {
  args: { modelValue: 3, totalPages: undefined, hasNextPage: true },
  render: (args) => ({
    components: { Pagination },
    setup: () => {
      const page = ref(args.modelValue)
      return { args, page }
    },
    template: `<Pagination v-bind="args" v-model="page" />`,
  }),
}

const RangesView = defineComponent({
  components: { Pagination },
  setup: () => ({
    cases: [
      { name: 'Few pages (no window)', modelValue: 2, totalPages: 4 },
      { name: 'Start of range', modelValue: 1, totalPages: 20 },
      { name: 'Middle of range', modelValue: 10, totalPages: 20 },
      { name: 'End of range', modelValue: 20, totalPages: 20 },
      {
        name: 'Wider window (sibling=2, boundary=2)',
        modelValue: 10,
        totalPages: 20,
        siblingCount: 2,
        boundaryCount: 2,
      },
    ],
  }),
  template: `
    <div class="flex flex-col gap-4">
      <div v-for="c in cases" :key="c.name" class="flex flex-col gap-1.5">
        <span class="font-body text-fg-subtle text-xs">{{ c.name }}</span>
        <Pagination
          :model-value="c.modelValue"
          :total-pages="c.totalPages"
          :sibling-count="c.siblingCount ?? 1"
          :boundary-count="c.boundaryCount ?? 1"
        />
      </div>
    </div>
  `,
})

export const Snapshot: Story = {
  render: () => ({
    components: { RangesView },
    template: `
      <div class="flex w-max flex-col gap-6 bg-bg-default p-6" data-testid="snap-board">
        <h2 class="font-heading font-bold text-fg-default text-lg">Page ranges</h2>
        <RangesView />
      </div>
    `,
  }),
}
