<script setup lang="ts">
import {
  ScrollAreaCorner,
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from 'reka-ui'
import { computed, useTemplateRef } from 'vue'

type Orientation = 'vertical' | 'horizontal' | 'both'
type ScrollType = 'auto' | 'always' | 'scroll' | 'hover'

withDefaults(
  defineProps<{
    orientation?: Orientation
    // reka-ui's ScrollArea `type` -- when the scrollbar shows. `hover` mirrors
    // the native overlay-scrollbar behaviour consumers already expect.
    type?: ScrollType
  }>(),
  { orientation: 'vertical', type: 'hover' },
)

// reka-ui's ScrollAreaViewport exposes its own DOM node via `expose`, not a
// plain template ref -- forward it so consumers driving their own scroll
// logic (e.g. AtVirtualList's tanstack virtualizer) can target the actual
// scrolling element instead of the ScrollAreaRoot wrapper.
const viewportRef = useTemplateRef<{ viewportElement?: HTMLElement }>('viewport')
const viewportElement = computed(() => viewportRef.value?.viewportElement ?? null)
defineExpose({ viewportElement })
</script>

<template>
  <ScrollAreaRoot :type="type" class="size-full overflow-hidden">
    <ScrollAreaViewport ref="viewport" class="size-full">
      <slot />
    </ScrollAreaViewport>
    <ScrollAreaScrollbar
      v-if="orientation === 'vertical' || orientation === 'both'"
      orientation="vertical"
      data-testid="scrollarea-scrollbar-vertical"
      class="flex w-2 touch-none select-none bg-surface-subtle p-0.5 transition-colors"
    >
      <ScrollAreaThumb
        data-testid="scrollarea-thumb-vertical"
        class="relative flex-1 rounded-full bg-border-strong"
      />
    </ScrollAreaScrollbar>
    <ScrollAreaScrollbar
      v-if="orientation === 'horizontal' || orientation === 'both'"
      orientation="horizontal"
      data-testid="scrollarea-scrollbar-horizontal"
      class="flex h-2 touch-none select-none bg-surface-subtle p-0.5 transition-colors"
    >
      <ScrollAreaThumb
        data-testid="scrollarea-thumb-horizontal"
        class="relative flex-1 rounded-full bg-border-strong"
      />
    </ScrollAreaScrollbar>
    <ScrollAreaCorner v-if="orientation === 'both'" class="bg-surface-subtle" />
  </ScrollAreaRoot>
</template>
