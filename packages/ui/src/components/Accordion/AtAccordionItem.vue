<script setup lang="ts">
import { PhCaretDown } from '@phosphor-icons/vue'
import { AccordionContent, AccordionHeader, AccordionItem, AccordionTrigger } from 'reka-ui'
import Icon from '../Icon/AtIcon.vue'

withDefaults(
  defineProps<{
    value: string
    // The common case: a text label. Use the #trigger slot instead for
    // richer header content (e.g. an icon + label, or a trailing badge).
    label?: string
    disabled?: boolean
  }>(),
  { label: undefined, disabled: false },
)
</script>

<template>
  <!-- Every item but the last draws its own bottom border -- the seam between
       rows, Card-header-divider style, without a separate Divider component. -->
  <AccordionItem
    :value="value"
    :disabled="disabled"
    class="[&:not(:last-child)]:border-b-[3px] [&:not(:last-child)]:border-solid [&:not(:last-child)]:border-[color:var(--color-border-default)]"
  >
    <AccordionHeader>
      <!-- group: the caret below reads the trigger's own data-state to flip,
           reka-ui wires aria-expanded + aria-controls/labelledby itself. -->
      <AccordionTrigger
        data-testid="accordion-trigger"
        class="group flex w-full cursor-pointer items-center justify-between gap-2 px-4 py-3 text-left font-bold text-fg-default disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus"
      >
        <slot name="trigger">{{ label }}</slot>
        <Icon
          :icon="PhCaretDown"
          weight="fill"
          size="sm"
          class="shrink-0 transition-transform duration-[120ms] ease-[ease] motion-reduce:transition-none group-data-[state=open]:rotate-180"
        />
      </AccordionTrigger>
    </AccordionHeader>
    <!-- The grid-rows trick: the row itself (not height) is what tweens, so no
         JS-measured height is needed. overflow-hidden on the inner wrapper
         clips the collapsing 0fr row; motion-reduce kills the tween outright. -->
    <AccordionContent
      data-testid="accordion-content"
      class="grid transition-[grid-template-rows] duration-[120ms] ease-[ease] motion-reduce:transition-none data-[state=closed]:grid-rows-[0fr] data-[state=open]:grid-rows-[1fr]"
    >
      <div class="overflow-hidden">
        <div class="px-4 py-4 text-fg-default">
          <slot />
        </div>
      </div>
    </AccordionContent>
  </AccordionItem>
</template>
