<script setup lang="ts">
import {
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from 'reka-ui'
import { onUnmounted, ref, watch } from 'vue'

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

// reka-ui's DropdownMenu has no built-in hover/focus-open (only
// click/Enter/Space/ArrowDown on the trigger) -- hand-rolled here. One shared
// `open` state for click, hover, and focus alike: hovering off closes it even
// if it was opened by a click. A short close delay lets the cursor travel
// diagonally from trigger to content without the menu closing underneath it.
const OPEN_DELAY_MS = 200
const CLOSE_DELAY_MS = 200
let openTimer: ReturnType<typeof setTimeout> | undefined
let closeTimer: ReturnType<typeof setTimeout> | undefined

// A mouse click also fires mouseenter on the trigger just before the click
// itself (the pointer has to arrive before it can click) -- opening
// immediately on hover would race the trigger's own click-toggle: hover
// opens it, then the toggle immediately closes it again. Delaying the
// hover-open (mirroring AtTooltip's delay-before-show) lets a real click
// resolve well before the timer fires, so the toggle acts on a still-closed
// menu; a genuine hover (no click) opens after the delay as normal.
function scheduleOpen() {
  clearTimeout(closeTimer)
  clearTimeout(openTimer)
  openTimer = setTimeout(() => {
    open.value = true
  }, OPEN_DELAY_MS)
}

function scheduleClose() {
  clearTimeout(openTimer)
  clearTimeout(closeTimer)
  closeTimer = setTimeout(() => {
    open.value = false
  }, CLOSE_DELAY_MS)
}

// Focusing the trigger opens it immediately (no delay -- keyboard users
// shouldn't wait). A click also focuses the trigger, which would hit the
// same race as hover; :focus-visible only matches keyboard-driven focus, not
// a mouse click's incidental focus, so this only fires for Tab/keyboard
// users and the click path is unaffected. Listens on `focusin` (bubbles)
// rather than `focus` since it's bound on the wrapping span, not the trigger
// element itself -- see the template comment on why the listeners live on a
// wrapper instead of DropdownMenuTrigger.
//
// Closing (Escape, or click-outside) also returns focus to the trigger --
// reka-ui's FocusScope does this itself once content unmounts -- which is
// keyboard-driven focus too and would otherwise satisfy :focus-visible and
// immediately reopen what Escape just closed. `closeReturnsFocus` is set by
// DropdownMenuContent's `close-auto-focus` event (fired as that return-focus
// is being scheduled) and consumed by the very next focusin, so only that
// one specific refocus is suppressed -- a genuine Tab onto the trigger still
// opens normally.
let closeReturnsFocus = false

function onContentCloseAutoFocus() {
  closeReturnsFocus = true
}

// reka-ui's own MenuContent keydown handler swallows Tab entirely while
// focus is inside (by design -- menus aren't meant to be Tab-navigated
// internally, see reka-ui's MenuContentImpl.vue handleKeyDown), so without
// this the dropdown would never close via Tab and focus would be stuck.
// Closing here (not preventing default ourselves) lets the browser's own
// focus-outside detection and remaining Tab semantics apply as normal once
// the content unmounts.
function onContentKeyDown(event: KeyboardEvent) {
  if (event.key === 'Tab') open.value = false
}

function onTriggerFocusIn(event: FocusEvent) {
  if (closeReturnsFocus) {
    closeReturnsFocus = false
    return
  }
  if ((event.target as HTMLElement).matches(':focus-visible')) {
    clearTimeout(openTimer)
    clearTimeout(closeTimer)
    open.value = true
  }
}

// Any open change not driven by our own timers (a click's toggle, Escape,
// click-outside -- all reka-ui internals we don't control) can leave a stray
// scheduled timer behind (e.g. a click's incidental mouseenter still counting
// down its open-delay after the click already opened the menu). Once state
// changes for any reason, a pending timer is stale and would otherwise fire
// later and flip `open` back against the current, more recent state.
watch(open, () => {
  clearTimeout(openTimer)
  clearTimeout(closeTimer)
})

onUnmounted(() => {
  clearTimeout(openTimer)
  clearTimeout(closeTimer)
})

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
    <!-- Hover/focus listeners live on this wrapper, not DropdownMenuTrigger
         itself -- attaching them directly to DropdownMenuTrigger's as-child
         slot broke its own internal click-toggle (reka-ui merges attrs
         through several nested as-child layers down to the real element, and
         adding extra listeners at that entry point disrupted it). A
         `contents`-display span sits outside that merge chain and adds no
         box of its own. -->
    <span
      class="contents"
      @mouseenter="scheduleOpen"
      @mouseleave="scheduleClose"
      @focusin="onTriggerFocusIn"
    >
      <DropdownMenuTrigger as-child>
        <slot name="trigger" />
      </DropdownMenuTrigger>
    </span>

    <DropdownMenuPortal :disabled="disableTeleport">
      <DropdownMenuContent
        :class="content"
        align="start"
        :side-offset="4"
        @mouseenter="scheduleOpen"
        @mouseleave="scheduleClose"
        @close-auto-focus="onContentCloseAutoFocus"
        @keydown="onContentKeyDown"
      >
        <slot />
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
