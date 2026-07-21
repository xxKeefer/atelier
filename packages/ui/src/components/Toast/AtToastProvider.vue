<script setup lang="ts">
import { computed } from 'vue'
import { ToastPortal, ToastProvider, ToastRoot, ToastViewport } from 'reka-ui'
import AtToast from './AtToast.vue'
import { useToast } from './useToast'

// Single-consumer design system: position is fixed top-right, not a prop.
const MAX_VISIBLE = 3

const { queue, dismiss } = useToast()

// Oldest-first: overflow entries stay queued past index 2 and surface in
// arrival order as visible slots free up via dismiss().
const visible = computed(() => queue.slice(0, MAX_VISIBLE))
</script>

<template>
  <ToastProvider>
    <ToastRoot
      v-for="entry in visible"
      :key="entry.id"
      data-testid="toast-root"
      :duration="entry.timeout ?? Number.POSITIVE_INFINITY"
      @update:open="(open) => !open && dismiss(entry.id)"
    >
      <AtToast
        :intent="entry.intent"
        :show-close="entry.timeout == null"
        @close="dismiss(entry.id)"
      >
        {{ entry.message }}
        <template v-if="entry.actions" #actions>
          <component :is="entry.actions" />
        </template>
      </AtToast>
    </ToastRoot>
    <ToastPortal>
      <ToastViewport
        data-testid="toast-viewport"
        class="fixed top-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2 outline-none"
      />
    </ToastPortal>
  </ToastProvider>
</template>
