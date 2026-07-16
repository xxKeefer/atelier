<script setup lang="ts">
import { PhX } from '@phosphor-icons/vue'
import { computed, useSlots } from 'vue'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from 'reka-ui'
import Icon from '../Icon/AtIcon.vue'
import Button from '../Button/AtButton.vue'

type Position = 'center' | 'left' | 'right' | 'top' | 'bottom'
type Size = 'sm' | 'md' | 'lg' | 'full'

const props = withDefaults(
  defineProps<{
    open?: boolean
    // Mounts already open, bypassing a trigger -- for the Snapshot board and
    // stories that show the modal without simulating a click. Not an AC.
    defaultOpen?: boolean
    title?: string
    subtitle?: string
    // Accessible name when no visible title is given (a title, once present,
    // already labels the dialog via aria-labelledby).
    ariaLabel?: string
    position?: Position
    size?: Size
    // A close control in the header. Turn off when a supplementary action
    // (e.g. a footer "Cancel" button) is the only way out.
    showCloseButton?: boolean
    // Renders in place instead of teleporting to the document body -- for the
    // Snapshot board, so a `defaultOpen` instance's fixed-position panel stays
    // scoped to a sized, transformed ancestor rather than the whole viewport.
    // Not an AC.
    disableTeleport?: boolean
  }>(),
  {
    open: undefined,
    defaultOpen: false,
    title: undefined,
    subtitle: undefined,
    ariaLabel: undefined,
    position: 'center',
    size: 'md',
    showCloseButton: true,
    disableTeleport: false,
  },
)

const emit = defineEmits<{ 'update:open': [value: boolean] }>()

const slots = useSlots()
const hasFooter = computed(() => slots.footer !== undefined)

// Centered dialogs sit in the middle of the viewport; edge positions slide in
// as sheets flush against that edge, full-bleed on the cross axis.
const positionClasses: Record<Position, string> = {
  center: 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl',
  left: 'left-0 top-0 h-full rounded-r-xl',
  right: 'right-0 top-0 h-full rounded-l-xl',
  top: 'left-0 top-0 w-full rounded-b-xl',
  bottom: 'left-0 bottom-0 w-full rounded-t-xl',
}

// Sizes cap the panel's cross-axis dimension. Edge sheets size along the axis
// perpendicular to the edge they slide from; center dialogs cap width.
const sizeClasses: Record<Position, Record<Size, string>> = {
  center: { sm: 'w-[24rem]', md: 'w-[32rem]', lg: 'w-[48rem]', full: 'w-[calc(100vw-2rem)]' },
  left: { sm: 'w-[20rem]', md: 'w-[28rem]', lg: 'w-[36rem]', full: 'w-screen' },
  right: { sm: 'w-[20rem]', md: 'w-[28rem]', lg: 'w-[36rem]', full: 'w-screen' },
  top: { sm: 'h-[12rem]', md: 'h-[18rem]', lg: 'h-[24rem]', full: 'h-screen' },
  bottom: { sm: 'h-[12rem]', md: 'h-[18rem]', lg: 'h-[24rem]', full: 'h-screen' },
}

// max-w/h-[calc(100vw/vh-2rem)] keeps the panel on-screen on viewports
// narrower/shorter than its requested size, with a small margin either side.
const panelClasses = computed(() => [
  'fixed z-50 flex max-h-[90vh] max-w-[calc(100vw-2rem)] flex-col overflow-hidden bg-surface-default text-fg-default font-body',
  'border-[3px] border-solid border-[color:var(--color-border-default)] shadow-higher',
  positionClasses[props.position],
  sizeClasses[props.position][props.size],
])
</script>

<template>
  <DialogRoot
    :open="open"
    :default-open="defaultOpen"
    modal
    @update:open="(value) => emit('update:open', value)"
  >
    <DialogTrigger v-if="$slots.trigger" as-child>
      <slot name="trigger" />
    </DialogTrigger>
    <DialogPortal :disabled="disableTeleport">
      <DialogOverlay data-testid="modal-overlay" class="fixed inset-0 z-40 bg-bg-scrim" />
      <DialogContent
        data-testid="modal-content"
        :aria-label="title === undefined ? ariaLabel : undefined"
        :class="panelClasses"
      >
        <div
          v-if="title !== undefined || showCloseButton"
          data-testid="modal-header"
          class="flex items-start justify-between gap-4 border-b-[3px] border-solid border-[color:var(--color-border-default)] px-4 py-3"
        >
          <div class="flex min-w-0 flex-1 flex-col gap-1">
            <DialogTitle
              v-if="title !== undefined"
              data-testid="modal-title"
              class="text-lg font-heading"
            >
              {{ title }}
            </DialogTitle>
            <DialogDescription
              v-if="subtitle !== undefined"
              data-testid="modal-subtitle"
              class="text-sm text-fg-muted"
            >
              {{ subtitle }}
            </DialogDescription>
          </div>
          <DialogClose v-if="showCloseButton" as-child>
            <Button variant="flat" intent="neutral" size="sm" aria-label="Close">
              <Icon :icon="PhX" size="lg" />
            </Button>
          </DialogClose>
        </div>

        <div data-testid="modal-body" class="flex-1 overflow-auto px-4 py-4">
          <slot />
        </div>

        <div
          v-if="hasFooter"
          data-testid="modal-footer"
          class="flex items-center justify-end gap-2 border-t-[3px] border-solid border-[color:var(--color-border-default)] px-4 py-3"
        >
          <slot name="footer" />
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
