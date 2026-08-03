<script setup lang="ts">
import {
  ScrollAreaCorner,
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from 'reka-ui'

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
</script>

<template>
  <ScrollAreaRoot :type="type" class="size-full overflow-hidden">
    <ScrollAreaViewport class="size-full">
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
