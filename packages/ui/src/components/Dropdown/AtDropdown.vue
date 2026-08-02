<script setup lang="ts">
import {
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from 'reka-ui'
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    // Mounts already open, bypassing a trigger click -- for the Snapshot
    // board and stories that show the content without simulating one.
    defaultOpen?: boolean
    // Renders the content in place instead of teleporting to the document
    // body -- for the Snapshot board, so a `defaultOpen` instance's
    // popper-positioned content stays scoped to the board.
    disableTeleport?: boolean
  }>(),
  {
    defaultOpen: false,
    disableTeleport: false,
  },
)

const open = ref(props.defaultOpen)

// Focusing the trigger opens it immediately, but only for keyboard focus:
// :focus-visible skips a mouse click's incidental focus. Listens on
// `focusin` (bubbles) since it is bound on the wrapping span, not the
// trigger itself -- see the template comment below.
//
// Closing (Escape/click-outside) also returns focus to the trigger via
// reka-ui's FocusScope, which is keyboard-driven focus too and would
// otherwise reopen what Escape just closed. `closeReturnsFocus`, set by
// DropdownMenuContent's `close-auto-focus` event, suppresses only that one
// refocus so a genuine Tab onto the trigger still opens normally.
let closeReturnsFocus = false

function onContentCloseAutoFocus() {
  closeReturnsFocus = true
}

// reka-ui's MenuContent swallows Tab entirely while focus is inside (by
// design, MenuContentImpl.vue's handleKeyDown), so without this the
// dropdown would never close via Tab. Closing here (not preventing default)
// lets the browser's own focus-outside detection apply once content unmounts.
function onContentKeyDown(event: KeyboardEvent) {
  if (event.key === 'Tab') open.value = false
}

function onTriggerFocusIn(event: FocusEvent) {
  if (closeReturnsFocus) {
    closeReturnsFocus = false
    return
  }
  if ((event.target as HTMLElement).matches(':focus-visible')) {
    open.value = true
  }
}

// Flat, no elevation -- a menu sits on the surface, it doesn't float above
// it. The container is just clipping chrome for the item stack's rounded
// corners; each AtDropdownItem carries its own border, matching Select's
// vertical GroupedControls gang (Foundations/GroupedControls > Vertical).
const content = 'overflow-hidden rounded-md bg-surface-default'
</script>

<template>
  <!-- modal="false": reka-ui's default modal menu locks pointer-events on
       the rest of the page while open, which strands the trigger itself
       (portalled content sits outside it) -- non-modal keeps the trigger
       clickable to toggle closed, and doesn't block the page like a dialog. -->
  <DropdownMenuRoot v-model:open="open" :modal="false">
    <!-- Listener lives on this wrapper, not DropdownMenuTrigger itself: reka-ui
         merges attrs through nested as-child layers, and listening there broke
         its internal click-toggle. This `contents`-display span sits outside
         that merge chain and adds no box of its own. -->
    <span class="contents" @focusin="onTriggerFocusIn">
      <DropdownMenuTrigger as-child>
        <slot name="trigger" />
      </DropdownMenuTrigger>
    </span>

    <DropdownMenuPortal :disabled="disableTeleport">
      <DropdownMenuContent
        :class="content"
        align="start"
        :side-offset="4"
        @close-auto-focus="onContentCloseAutoFocus"
        @keydown="onContentKeyDown"
      >
        <slot />
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
