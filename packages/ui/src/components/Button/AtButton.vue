<script setup lang="ts">
import { PhCircleNotch } from '@phosphor-icons/vue'
import { Comment, computed, useSlots } from 'vue'
import Icon from '../Icon/AtIcon.vue'

type Intent = 'primary' | 'secondary' | 'neutral' | 'danger' | 'success' | 'warning' | 'info'
type Variant = 'default' | 'flat'
type Size = 'sm' | 'md' | 'lg' | 'xl'

const props = withDefaults(
  defineProps<{
    intent?: Intent
    variant?: Variant
    size?: Size
    type?: 'button' | 'submit' | 'reset'
    href?: string
    disabled?: boolean
    loading?: boolean
  }>(),
  {
    intent: 'primary',
    variant: 'default',
    size: 'md',
    type: 'button',
    href: undefined,
    disabled: false,
    loading: false,
  },
)

// loading is an inert state: the button can't be clicked, so it folds into the
// disabled attribute (and inherits the disabled styling). The skeleton-style
// pulse on top signals "busy" rather than "off". motion-reduce stills it.
const isDisabled = computed(() => props.disabled || props.loading)

// An href resolves the root to an <a> (role=link); otherwise a <button>
// (role=button). The role falls out of the element choice, no aria-role needed.
const tag = computed(() => (props.href !== undefined ? 'a' : 'button'))

// Per-element root attributes. A <button> carries native type + disabled. An
// <a> has neither: it always opens in a new tab (target=_blank + rel guards
// reverse-tabnabbing); when inert it drops the href (so it isn't navigable) and
// announces via aria-disabled; pointer-events-none (added to classes) blocks the
// cursor.
const rootProps = computed(() =>
  props.href !== undefined
    ? {
        href: isDisabled.value ? undefined : props.href,
        target: '_blank',
        rel: 'noopener noreferrer',
        'aria-disabled': isDisabled.value || undefined,
      }
    : { type: props.type, disabled: isDisabled.value },
)

// One mutually-exclusive cursor (stacked cursor utilities have unreliable order):
// busy while loading, blocked while disabled, actionable otherwise.
const cursor = computed(() =>
  props.loading ? 'cursor-wait' : props.disabled ? 'cursor-not-allowed' : 'cursor-pointer',
)

const slots = useSlots()
// Icon-only when nothing renders in the default slot. The named icon slots
// (#left/#right) don't count as a label, so a button with only an icon trips
// the square padding + leans on aria-label for its accessible name.
const iconOnly = computed(() => {
  const nodes = slots.default?.()
  if (!nodes) return true
  return nodes.every((n) => n.children === null || n.children === '' || n.type === Comment)
})

// Fill, text, and transition shared by both variants. The intent vars
// (--btn-bg/-fg/-edge) are bound per-element via :style below. enabled: gates
// the interaction states so disabled buttons stay inert. motion-reduce kills
// the transition. ease-[ease] preserves the CSS keyword (not Tailwind's default
// ease-in-out curve).
// Only filter (brightness) is transitioned. The shadow edge and the lift
// translate must change in lockstep to keep the edge's bottom pinned, but
// Tailwind's box-shadow rides --tw-shadow (syntax "*", non-interpolable) so it
// can never tween -- it snaps. Were transform tweened on its own it would lag
// the snapping shadow, unpinning the base mid-transition (shadow jumps up, then
// the cap drifts down). So the geometry snaps as one; only the glow eases.
const base =
  'inline-flex items-center justify-center font-body font-bold rounded-md select-none ' +
  'bg-[var(--btn-bg)] text-[var(--btn-fg)] ' +
  'transition-[filter] duration-[120ms] ease-[ease] motion-reduce:transition-none ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus'

// Text buttons get asymmetric padding; icon-only buttons get equal padding so
// they read square. gap drives the spacing between icon slots and the label.
// sm's text uses leading-none (unlike every other tier) so its box height
// matches its icon-only sibling exactly -- an icon glyph is already
// effectively line-height:1 (AtIcon's wrapper is leading-none), so a text
// button at the same font size only lines up if it drops the font's own
// line-height too. The other tiers don't need this: nothing forced their
// icon-only/text pair to match height, so they keep their inherited mismatch.
const sizes: Record<Size, string> = {
  sm: 'text-sm leading-none px-3 py-1.5 gap-1.5',
  md: 'text-sm px-3 py-1.5 gap-1.5',
  lg: 'text-base px-4 py-2 gap-2',
  xl: 'text-lg px-6 py-3 gap-2',
}

const iconOnlySizes: Record<Size, string> = {
  sm: 'text-sm p-1.5 gap-1.5',
  md: 'text-sm p-1.5 gap-1.5',
  lg: 'text-base p-2 gap-2',
  xl: 'text-lg p-3 gap-2',
}

// The mechanic -- rest, press, depress. default rides the elevation lift util off
// the shadow + lift tokens: every state pins the hard edge's bottom to the same
// baseline (translate-up == shadow-down). Rest sits popped at the `higher` rung
// (lift-full); hover presses halfway to `high` (lift-half); active drops flush
// (translate-0) onto the colourway's inset `low`, so the press travel reads as a
// real key sinking into the surface. The coloured edge comes from the per-intent
// shadow tokens (intentShadows below); flat is a quieter intent-tied border off
// --btn-edge.
const variants: Record<Variant, string> = {
  default:
    '-translate-y-lift-full ' +
    'hover:enabled:-translate-y-lift-half hover:enabled:brightness-[1.08] ' +
    'active:enabled:translate-y-0 active:enabled:brightness-95 ' +
    'disabled:translate-y-0 disabled:shadow-flat',
  flat:
    'border-[3px] border-solid border-[color:var(--btn-edge)] ' +
    'hover:enabled:brightness-[1.08] ' +
    'active:enabled:translate-y-lift-half active:enabled:brightness-95',
}

// The default variant's coloured edge ladder, per intent. Rest = `higher` (4px
// edge), hover = `high` (2px), active = the inset `low` recess. Tailwind only
// scans literals, so every utility is spelled out. neutral takes the plain
// neutral ladder; the rest take their colourway's hue-matched edge.
const intentShadows: Record<Intent, string> = {
  primary:
    'shadow-primary-higher hover:enabled:shadow-primary-high active:enabled:shadow-primary-low',
  secondary:
    'shadow-secondary-higher hover:enabled:shadow-secondary-high active:enabled:shadow-secondary-low',
  neutral: 'shadow-higher hover:enabled:shadow-high active:enabled:shadow-low',
  danger: 'shadow-danger-higher hover:enabled:shadow-danger-high active:enabled:shadow-danger-low',
  success:
    'shadow-success-higher hover:enabled:shadow-success-high active:enabled:shadow-success-low',
  warning:
    'shadow-warning-higher hover:enabled:shadow-warning-high active:enabled:shadow-warning-low',
  info: 'shadow-info-higher hover:enabled:shadow-info-high active:enabled:shadow-info-low',
}

// Each intent supplies the fill, the text colour, and its own dark edge (the
// skeuomorphic "side"). The mechanic above is the same for every intent,
// driven off these three vars.
const intentVars: Record<Intent, Record<'--btn-bg' | '--btn-fg' | '--btn-edge', string>> = {
  primary: {
    '--btn-bg': 'var(--color-primary-default)',
    '--btn-fg': 'var(--color-primary-fg)',
    '--btn-edge': 'var(--color-primary-edge)',
  },
  secondary: {
    '--btn-bg': 'var(--color-secondary-default)',
    '--btn-fg': 'var(--color-secondary-fg)',
    '--btn-edge': 'var(--color-secondary-edge)',
  },
  neutral: {
    '--btn-bg': 'var(--color-surface-default)',
    // the fill is already dark, so a darker "side" vanishes into the canvas;
    // the structural border colour is the visible neutral edge.
    '--btn-fg': 'var(--color-fg-default)',
    '--btn-edge': 'var(--color-border-default)',
  },
  danger: {
    '--btn-bg': 'var(--color-danger-solid)',
    '--btn-fg': 'var(--color-danger-on-solid)',
    '--btn-edge': 'var(--color-danger-edge)',
  },
  success: {
    '--btn-bg': 'var(--color-success-solid)',
    '--btn-fg': 'var(--color-success-on-solid)',
    '--btn-edge': 'var(--color-success-edge)',
  },
  warning: {
    '--btn-bg': 'var(--color-warning-solid)',
    '--btn-fg': 'var(--color-warning-on-solid)',
    '--btn-edge': 'var(--color-warning-edge)',
  },
  info: {
    '--btn-bg': 'var(--color-info-solid)',
    '--btn-fg': 'var(--color-info-on-solid)',
    '--btn-edge': 'var(--color-info-edge)',
  },
}

const classes = computed(() => [
  base,
  cursor.value,
  iconOnly.value ? iconOnlySizes[props.size] : sizes[props.size],
  variants[props.variant],
  // The default variant's edge is intent-coloured, so it can't live in the
  // shared variant string -- pull the per-intent shadow ladder here.
  props.variant === 'default' && intentShadows[props.intent],
  // Static dim for an explicitly-disabled button. Skipped while loading: the
  // skeleton pulse already dips opacity to .5 at its trough, and dimming to .5
  // statically would pin it there -- killing the pulse's visible range.
  props.disabled && !props.loading && 'opacity-50',
  props.loading && 'animate-pulse motion-reduce:animate-none',
  // Link path only: a button uses its native disabled to go inert; an anchor
  // needs pointer-events killed since aria-disabled is advisory, not enforced.
  props.href !== undefined && isDisabled.value && 'pointer-events-none',
])
</script>

<template>
  <!-- Root resolves to <a> when an href is passed, else <button>; rootProps
       carries the per-element attrs. aria-label (and any other native attr)
       falls through. It is required for icon-only buttons so they still
       announce; axe enforces it. -->
  <component :is="tag" v-bind="rootProps" :class="classes" :style="intentVars[intent]">
    <!-- While loading a default circle-notch spinner replaces the #left slot
         (overriding any consumer icon); otherwise the slot renders untouched,
         preserving icon DOM order. -->
    <span
      v-if="loading"
      data-testid="spinner"
      class="inline-flex animate-spin motion-reduce:animate-none"
    >
      <Icon :icon="PhCircleNotch" />
    </span>
    <slot v-else name="left" />
    <slot />
    <slot name="right" />
  </component>
</template>
