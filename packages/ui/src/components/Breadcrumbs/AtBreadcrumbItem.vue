<script setup lang="ts">
import { PhCaretRight } from '@phosphor-icons/vue'
import { inject, type Component } from 'vue'
import AtIcon from '../Icon/AtIcon.vue'
import AtLink from '../Link/AtLink.vue'
import { BREADCRUMB_SEPARATOR_KEY } from './AtBreadcrumbs.vue'

withDefaults(
  defineProps<{
    href?: string
    disabled?: boolean
    // Marks the page the user is already on: renders as plain text instead
    // of a link, since navigating to the current page is a no-op.
    current?: boolean
    icon?: Component
  }>(),
  { href: undefined, disabled: false, current: false, icon: undefined },
)

const separator = inject(BREADCRUMB_SEPARATOR_KEY, PhCaretRight)
</script>

<template>
  <li class="flex items-center gap-1.5 first:[&>.at-breadcrumb-separator]:hidden">
    <AtIcon
      :icon="separator"
      size="sm"
      color="var(--color-fg-subtle)"
      class="at-breadcrumb-separator"
      data-testid="breadcrumb-separator"
    />
    <span
      v-if="current"
      aria-current="page"
      class="inline-flex items-center gap-1.5 text-fg-default"
    >
      <AtIcon v-if="icon" :icon="icon" size="md" />
      <slot />
    </span>
    <AtLink v-else :href="href" :disabled="disabled" class="text-fg-muted">
      <template v-if="icon" #left><AtIcon :icon="icon" size="md" /></template>
      <slot />
    </AtLink>
  </li>
</template>
