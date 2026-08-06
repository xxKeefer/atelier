<script setup lang="ts">
import { PhCaretLeft, PhCaretRight } from '@phosphor-icons/vue'
import { computed } from 'vue'
import Icon from '../Icon/AtIcon.vue'
import Select from '../Select/AtSelect.vue'
import { ELLIPSIS, getPaginationRange } from './usePaginationRange'

const props = withDefaults(
  defineProps<{
    // v-model: the current 1-indexed page.
    modelValue: number
    // Omit when the total page count is unknown ahead of time -- the
    // component switches to indeterminate mode: prev/next only, no page
    // buttons, no windowing/ellipsis.
    totalPages?: number
    // Pages shown on each side of the current page.
    siblingCount?: number
    // Pages always pinned at the very start/end of the range.
    boundaryCount?: number
    // Indeterminate mode only: whether a next page exists. Only the
    // consumer's data source knows this, so it isn't derived internally.
    hasNextPage?: boolean
    // v-model:pageSize: the currently selected items-per-page value.
    pageSize?: number
    // Selectable items-per-page values. The selector only renders when this
    // is non-empty -- it's an opt-in addition, not every consumer paginates
    // a resizable list.
    pageSizeOptions?: number[]
  }>(),
  {
    totalPages: undefined,
    siblingCount: 1,
    boundaryCount: 1,
    hasNextPage: true,
    pageSize: undefined,
    pageSizeOptions: () => [],
  },
)

const emit = defineEmits<{
  'update:modelValue': [page: number]
  'update:pageSize': [size: number]
}>()

const isIndeterminate = computed(() => props.totalPages === undefined)

const range = computed(() => {
  if (props.totalPages === undefined) return []
  return getPaginationRange(
    props.modelValue,
    props.totalPages,
    props.siblingCount,
    props.boundaryCount,
  )
})

const canGoPrev = computed(() => props.modelValue > 1)
const canGoNext = computed(() =>
  props.totalPages === undefined ? props.hasNextPage : props.modelValue < props.totalPages,
)

function goTo(page: number) {
  if (page === props.modelValue || page < 1) return
  if (props.totalPages !== undefined && page > props.totalPages) return
  emit('update:modelValue', page)
}

// Dynamic labels give assistive tech real context instead of a bare number --
// "Go to page 5 of 20" rather than just "5". Indeterminate mode drops the
// "of N" clause since the total is unknown.
function pageButtonLabel(page: number) {
  return props.totalPages === undefined
    ? `Go to page ${String(page)}`
    : `Go to page ${String(page)} of ${String(props.totalPages)}`
}

const currentPageLabel = computed(() =>
  props.totalPages === undefined
    ? `Page ${String(props.modelValue)}, current page`
    : `Page ${String(props.modelValue)} of ${String(props.totalPages)}, current page`,
)

const showPageSize = computed(() => props.pageSizeOptions.length > 0)
const pageSizeItems = computed(() =>
  props.pageSizeOptions.map((size) => ({ value: String(size), label: String(size) })),
)
const pageSizeModelValue = computed(() =>
  props.pageSize === undefined ? undefined : String(props.pageSize),
)

function onPageSizeChange(value: string) {
  const size = Number(value)
  if (size === props.pageSize) return
  emit('update:pageSize', size)
}

// The mechanic mirrors AtButtonGroupItem: rest sits popped at `higher`, hover
// presses halfway to `high`, the current page depresses to `low` and stays --
// the depressed look IS the "you are here" indicator, not a separate style.
// Unlike ButtonGroup's reka-ui RadioGroup, the current page is not a
// radio-checked item -- it's a plain non-interactive element (a <span>, not a
// <button>), so it can never be re-clicked or refocused as an actionable
// control per the AC.
const pageButtonBase =
  'inline-flex h-9 min-w-9 items-center justify-center rounded-md border-thick px-2 ' +
  'font-body text-sm font-bold text-fg-default ' +
  'transition-shape-press ' +
  'cursor-pointer enabled:shadow-higher hover:enabled:shadow-high hover:enabled:brightness-[1.08] ' +
  'enabled:-translate-y-lift-full hover:enabled:-translate-y-lift-half ' +
  'active:enabled:translate-y-0 active:enabled:brightness-95 ' +
  'disabled:translate-y-0 disabled:shadow-flat disabled:opacity-50 disabled:cursor-not-allowed ' +
  'focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus'

const currentPageClasses =
  'inline-flex h-9 min-w-9 items-center justify-center rounded-md border-[3px] border-solid px-2 ' +
  'font-body text-sm font-bold select-none ' +
  'bg-primary-default text-primary-fg border-primary-border-default shadow-flat translate-y-0'

// Matches the page buttons' silhouette (border, radius, height) so it holds
// the row's rhythm, but styled like a disabled control -- flat shadow, dimmed,
// no hover -- so it still reads as "not a page". Three static dots rather
// than a text glyph, evenly spaced like the icon buttons either side of it.
const ellipsisClasses =
  'inline-flex h-9 min-w-9 items-center justify-center gap-0.5 rounded-md border-thick px-2 ' +
  'shadow-flat opacity-50 select-none'
const ellipsisDotClasses = 'size-1 rounded-full bg-fg-subtle'
</script>

<template>
  <nav aria-label="Pagination" class="flex items-center gap-1.5">
    <button
      type="button"
      data-testid="pagination-prev"
      aria-label="Previous page"
      :disabled="!canGoPrev"
      :class="pageButtonBase"
      @click="goTo(modelValue - 1)"
    >
      <Icon :icon="PhCaretLeft" />
    </button>

    <!-- Indeterminate mode: total page count is unknown, so there's no
         window to compute -- just the current page, navigated one at a
         time via prev/next. -->
    <span
      v-if="isIndeterminate"
      data-testid="pagination-page"
      aria-current="page"
      :aria-label="currentPageLabel"
      :class="currentPageClasses"
      >{{ modelValue }}</span
    >

    <template
      v-for="(item, index) in range"
      v-else
      :key="item === ELLIPSIS ? `ellipsis-${index}` : item"
    >
      <span
        v-if="item === ELLIPSIS"
        data-testid="pagination-ellipsis"
        :class="ellipsisClasses"
        aria-hidden="true"
      >
        <span :class="ellipsisDotClasses" />
        <span :class="ellipsisDotClasses" />
        <span :class="ellipsisDotClasses" />
      </span>

      <!-- The current page is a non-interactive element: aria-current marks it
           for assistive tech, but it's a <span>, not a <button> -- it never
           receives a click handler or tab stop, so it can't be re-activated. -->
      <span
        v-else-if="item === modelValue"
        data-testid="pagination-page"
        aria-current="page"
        :aria-label="currentPageLabel"
        :class="currentPageClasses"
        >{{ item }}</span
      >
      <button
        v-else
        type="button"
        data-testid="pagination-page"
        :aria-label="pageButtonLabel(item)"
        :class="pageButtonBase"
        @click="goTo(item)"
      >
        {{ item }}
      </button>
    </template>

    <button
      type="button"
      data-testid="pagination-next"
      aria-label="Next page"
      :disabled="!canGoNext"
      :class="pageButtonBase"
      @click="goTo(modelValue + 1)"
    >
      <Icon :icon="PhCaretRight" />
    </button>

    <!-- Opt-in items-per-page control, built on AtSelect (itself built on
         reka-ui's Select primitive) rather than hand-rolled. Only renders
         when the consumer supplies pageSizeOptions. -->
    <Select
      v-if="showPageSize"
      data-testid="pagination-page-size"
      class="ml-1"
      size="sm"
      aria-label="Items per page"
      :options="pageSizeItems"
      :model-value="pageSizeModelValue"
      @update:model-value="onPageSizeChange"
    />

    <!-- Visually hidden live region: announces the current page whenever it
         changes, so a screen reader user navigating by keyboard hears the new
         state even though focus stays on the prev/next button they pressed. -->
    <span data-testid="pagination-live-region" aria-live="polite" class="sr-only">{{
      currentPageLabel
    }}</span>
  </nav>
</template>
