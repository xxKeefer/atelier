<script setup lang="ts">
import { computed } from 'vue';

type Intent = 'primary' | 'secondary' | 'neutral' | 'danger' | 'success' | 'warning' | 'info';
type Variant = 'default' | 'flat';
type Size = 'sm' | 'md' | 'lg';

const props = withDefaults(
  defineProps<{
    intent?: Intent;
    variant?: Variant;
    size?: Size;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
  }>(),
  { intent: 'primary', variant: 'default', size: 'md', type: 'button', disabled: false }
);

const base =
  'btn inline-flex items-center justify-center font-body font-bold rounded-md select-none ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus';

const sizes: Record<Size, string> = {
  sm: 'text-sm px-3 py-1.5 gap-1.5',
  md: 'text-base px-4 py-2 gap-2',
  lg: 'text-lg px-6 py-3 gap-2'
};

// Each intent supplies the fill, the text colour, and its own dark edge (the
// skeuomorphic "side"). The mechanic -- pop, depress, sink -- is the same for
// every intent and lives in the scoped style, driven off these three vars.
const intentVars: Record<Intent, Record<'--btn-bg' | '--btn-fg' | '--btn-edge', string>> = {
  primary: {
    '--btn-bg': 'var(--color-brand-primary-default)',
    '--btn-fg': 'var(--color-brand-primary-fg)',
    '--btn-edge': 'var(--color-brand-primary-edge)'
  },
  secondary: {
    '--btn-bg': 'var(--color-brand-secondary-default)',
    '--btn-fg': 'var(--color-brand-secondary-fg)',
    '--btn-edge': 'var(--color-brand-secondary-edge)'
  },
  neutral: {
    '--btn-bg': 'var(--color-bg-raised)',
    '--btn-fg': 'var(--color-fg-default)',
    '--btn-edge': 'var(--palette-neutral-950)'
  },
  danger: {
    '--btn-bg': 'var(--color-status-danger-solid)',
    '--btn-fg': 'var(--color-status-danger-on-solid)',
    '--btn-edge': 'var(--color-status-danger-edge)'
  },
  success: {
    '--btn-bg': 'var(--color-status-success-solid)',
    '--btn-fg': 'var(--color-status-success-on-solid)',
    '--btn-edge': 'var(--color-status-success-edge)'
  },
  warning: {
    '--btn-bg': 'var(--color-status-warning-solid)',
    '--btn-fg': 'var(--color-status-warning-on-solid)',
    '--btn-edge': 'var(--color-status-warning-edge)'
  },
  info: {
    '--btn-bg': 'var(--color-status-info-solid)',
    '--btn-fg': 'var(--color-status-info-on-solid)',
    '--btn-edge': 'var(--color-status-info-edge)'
  }
};

const classes = computed(() => [base, sizes[props.size], `btn--${props.variant}`]);
</script>

<template>
  <button :type="type" :disabled="disabled" :class="classes" :style="intentVars[intent]">
    <slot />
  </button>
</template>

<style scoped>
.btn {
  background: var(--btn-bg);
  color: var(--btn-fg);
  transition:
    transform 120ms ease,
    box-shadow 120ms ease,
    filter 120ms ease;
}

/* Default: brutal skeuomorphic. A hard, no-blur bottom edge in the fill's own
   dark shade makes it stand off the page; a soft ambient sells the lift. */
.btn--default {
  box-shadow:
    0 4px 0 0 var(--btn-edge),
    0 5px 8px 0 rgba(0, 0, 0, 0.4);
}

/* Hover: depress a little -- drop 2px, edge halves, fill lightens to greet the cursor. */
.btn--default:hover:not(:disabled) {
  transform: translateY(2px);
  box-shadow:
    0 2px 0 0 var(--btn-edge),
    0 3px 6px 0 rgba(0, 0, 0, 0.4);
  filter: brightness(1.08);
}

/* Active: fully depressed -- sits flush, edge collapses, sinks into the page. */
.btn--default:active:not(:disabled) {
  transform: translateY(4px);
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  filter: brightness(0.95);
}

/* Disabled: half-depressed and dimmed, inert. */
.btn--default:disabled {
  transform: translateY(2px);
  box-shadow: 0 2px 0 0 var(--btn-edge);
  opacity: 0.5;
  cursor: not-allowed;
}

/* Flat: same fill, no lift -- just a subtler intent-tied border. */
.btn--flat {
  border: 2px solid var(--btn-edge);
}

.btn--flat:hover:not(:disabled) {
  filter: brightness(1.08);
}

.btn--flat:active:not(:disabled) {
  filter: brightness(0.95);
}

.btn--flat:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (prefers-reduced-motion: reduce) {
  .btn {
    transition: none;
  }
}
</style>
