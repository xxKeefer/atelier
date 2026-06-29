<script setup lang="ts">
import { computed, useSlots } from 'vue'
import Divider from './AtDivider.vue'

type MediaPosition = 'top' | 'left' | 'right'

const props = withDefaults(
  defineProps<{
    // An href makes the whole card a single tappable action (renders an <a>);
    // it gains the lift/press affordance and a pointer cursor. A card used this
    // way shouldn't also nest its own links/buttons -- anchor-in-anchor is
    // invalid. Use the footer-actions shape for that instead.
    href?: string
    // Where the #media slot sits relative to the content column. top is a
    // full-bleed band above everything; left/right place it flush alongside.
    mediaPosition?: MediaPosition
  }>(),
  { href: undefined, mediaPosition: 'top' },
)

const slots = useSlots()
const hasMedia = computed(() => slots.media !== undefined)
const hasHeader = computed(() => slots.header !== undefined)
const hasFooter = computed(() => slots.footer !== undefined)

const isInteractive = computed(() => props.href !== undefined)
const tag = computed(() => (props.href !== undefined ? 'a' : 'div'))

// An absolute (http(s)://) or protocol-relative (//) href points off-site:
// it opens in a new tab, guarded against reverse-tabnabbing. Internal paths
// (/route, #hash, relative) navigate in place.
const isExternal = computed(() => props.href !== undefined && /^(https?:)?\/\//.test(props.href))
const rootProps = computed(() => {
  if (props.href === undefined) return {}
  return isExternal.value
    ? { href: props.href, target: '_blank', rel: 'noopener noreferrer' }
    : { href: props.href }
})

// Side media puts the content column next to the media band; top (or no media)
// keeps a plain column. right just reverses the row.
const rowClass = computed(() => {
  if (!hasMedia.value || props.mediaPosition === 'top') return 'flex flex-col'
  return props.mediaPosition === 'right' ? 'flex flex-row-reverse' : 'flex flex-row'
})

// The surface: a bordered panel on the default surface. overflow-hidden clips
// full-bleed media to the radius. The drop shadow is set per branch below (static
// cards rest at high, one tier below a button's higher; interactive ones extrude).
const base =
  'relative flex flex-col bg-surface-default text-fg-default font-body ' +
  'border-[3px] border-solid border-[color:var(--color-border-default)] rounded-md overflow-hidden'

// Static card: high on the elevation ladder, one tier quieter than a button (higher).
const staticShadow = 'shadow-high'

// Interactive card: the same extruded mechanic as a default button -- a chunky
// hard bottom edge plus ambient, sinking toward the cursor on hover and pressing
// flush on click. The edge is the card's border colour, not the canvas shade:
// the page is near-black, so a canvas-coloured lip would vanish into it -- the
// border tone reads as the card's thickness. motion-reduce stills it; the focus
// ring matches the rest of the system.
const interactive =
  'cursor-pointer transition-[transform,box-shadow,filter] duration-[120ms] ease-[ease] motion-reduce:transition-none ' +
  'shadow-[0_6px_0_0_var(--color-border-default),0_8px_8px_0_rgba(0,0,0,0.4)] ' +
  'hover:translate-y-[2px] hover:shadow-[0_4px_0_0_var(--color-border-default),0_5px_6px_0_rgba(0,0,0,0.4)] hover:brightness-[1.04] ' +
  'active:translate-y-[6px] active:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.5)] active:brightness-95 ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus'

const classes = computed(() => [base, isInteractive.value ? interactive : staticShadow])

// Each region owns its padding so the dividers sit flush, full-bleed between
// them -- the card-divider look. Header/footer are flex rows that compose
// actions (a close button at the header's right edge, action buttons or a
// summary in the footer) via justify-between.
const region = 'flex items-center justify-between gap-2 px-4 py-3'
</script>

<template>
  <component :is="tag" v-bind="rootProps" :class="classes">
    <!-- Full-bleed media band above everything. -->
    <slot v-if="hasMedia && mediaPosition === 'top'" name="media" />

    <div :class="rowClass">
      <!-- Side media: flush alongside the content column. shrink-0 lets the
           consumer's media own its width without the column squeezing it. -->
      <div
        v-if="hasMedia && mediaPosition !== 'top'"
        data-testid="card-media-side"
        class="flex shrink-0"
      >
        <slot name="media" />
      </div>

      <div class="flex min-w-0 flex-1 flex-col">
        <template v-if="hasHeader">
          <div data-testid="card-header" :class="region">
            <slot name="header" />
          </div>
          <Divider class="bg-border-default" />
        </template>

        <div data-testid="card-body" class="px-4 py-4">
          <slot />
        </div>

        <template v-if="hasFooter">
          <Divider class="bg-border-default" />
          <div data-testid="card-footer" :class="region">
            <slot name="footer" />
          </div>
        </template>
      </div>
    </div>
  </component>
</template>
