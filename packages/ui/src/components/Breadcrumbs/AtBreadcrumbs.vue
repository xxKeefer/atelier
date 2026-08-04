<script lang="ts">
import type { Component, InjectionKey } from 'vue'

// AtBreadcrumbItem reads the separator off this instead of a prop drilled
// through the ol/slot boundary -- items are slotted children, not direct
// props recipients of AtBreadcrumbs.
export const BREADCRUMB_SEPARATOR_KEY: InjectionKey<Component> = Symbol('breadcrumb-separator')
</script>

<script setup lang="ts">
import { PhCaretRight } from '@phosphor-icons/vue'
import { Comment, h, provide, useSlots, type VNode } from 'vue'
import AtDropdown from '../Dropdown/AtDropdown.vue'
import AtDropdownItem from '../Dropdown/AtDropdownItem.vue'
import AtIcon from '../Icon/AtIcon.vue'
import { COLLAPSED, getBreadcrumbRange } from './useBreadcrumbRange'

const props = withDefaults(defineProps<{ separator?: Component; maxItems?: number }>(), {
  separator: () => PhCaretRight,
  maxItems: undefined,
})

// Same three-static-dots glyph as AtPagination's ellipsis, sized up a step
// (size-1.5 vs Pagination's size-1) since this one sits inline in a text-sm
// row rather than a fixed h-9 button.
const overflowDotClasses = 'size-1.5 rounded-full bg-fg-subtle group-hover:bg-fg-default'

provide(BREADCRUMB_SEPARATOR_KEY, props.separator)

const slots = useSlots()

// Reads href/disabled/current/icon straight off the slotted AtBreadcrumbItem
// vnode's props, and its label out of the vnode's own default-slot function
// (a compiled component vnode's children is a slots object, not text) --
// there is no items-array to read this from, since AtBreadcrumbs stays a
// pure compound component.
function hiddenItemMeta(vnode: VNode) {
  const itemProps = (vnode.props ?? {}) as {
    href?: string
    disabled?: boolean
    current?: boolean
    icon?: Component
  }
  const slotFn = (vnode.children as { default?: () => VNode[] } | null)?.default
  const label = (slotFn?.() ?? [])
    .map((child) => (typeof child.children === 'string' ? child.children : ''))
    .join('')
  return {
    href: itemProps.href,
    icon: itemProps.icon,
    label,
    // A hidden "current" item is still the page the user is on -- never
    // navigable, even collapsed.
    disabled: itemProps.disabled ?? itemProps.current ?? false,
  }
}

function buildOverflowItem(hidden: VNode[]) {
  return h('li', { class: 'flex items-center gap-1.5' }, [
    h(AtIcon, {
      icon: props.separator,
      size: 'sm',
      color: 'var(--color-fg-subtle)',
      class: 'at-breadcrumb-separator',
      'data-testid': 'breadcrumb-separator',
    }),
    h(
      AtDropdown,
      {},
      {
        trigger: () =>
          h(
            'button',
            {
              type: 'button',
              'aria-label': 'Show hidden breadcrumb items',
              class: 'group flex items-center gap-0.5',
              'data-testid': 'breadcrumb-overflow-trigger',
            },
            [
              h('span', { class: overflowDotClasses }),
              h('span', { class: overflowDotClasses }),
              h('span', { class: overflowDotClasses }),
            ],
          ),
        default: () =>
          hidden.map((vnode) => {
            const meta = hiddenItemMeta(vnode)
            return h(
              AtDropdownItem,
              {
                disabled: meta.disabled,
                onSelect: () => {
                  if (!meta.disabled && meta.href) window.location.assign(meta.href)
                },
              },
              {
                default: () => [
                  meta.icon ? h(AtIcon, { icon: meta.icon, size: 'md', class: 'mr-1.5' }) : null,
                  meta.label,
                ],
              },
            )
          }),
      },
    ),
  ])
}

// Runs as a functional component (bound via `:is` below) rather than a
// computed -- reading slots.default() isn't tracked reactively, so a
// computed here would cache stale output across parent re-renders. As a
// function invoked from inside the render tree, it re-reads fresh each time.
function renderItems() {
  const items = (slots.default?.() ?? []).filter((vnode) => vnode.type !== Comment)
  if (!props.maxItems || items.length <= props.maxItems) return items

  const range = getBreadcrumbRange(items.length, props.maxItems)
  const tailCount = props.maxItems - 1
  const hidden = items.slice(1, items.length - tailCount)
  return range.map((slot) =>
    slot === COLLAPSED ? buildOverflowItem(hidden) : items[slot],
  ) as VNode[]
}
</script>

<template>
  <nav aria-label="Breadcrumb">
    <ol class="flex flex-wrap items-center gap-1.5 font-body text-sm">
      <component :is="renderItems" />
    </ol>
  </nav>
</template>
