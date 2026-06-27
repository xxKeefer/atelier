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

// Fill, text, and transition shared by both variants. The intent vars
// (--btn-bg/-fg/-edge) are bound per-element via :style below. enabled: gates
// the interaction states so disabled buttons stay inert. motion-reduce kills
// the transition. ease-[ease] preserves the CSS keyword (not Tailwind's default
// ease-in-out curve).
const base =
  'inline-flex items-center justify-center font-body font-bold rounded-md select-none ' +
  'bg-[var(--btn-bg)] text-[var(--btn-fg)] ' +
  'transition-[transform,box-shadow,filter] duration-[120ms] ease-[ease] motion-reduce:transition-none ' +
  'disabled:opacity-50 disabled:cursor-not-allowed ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus';

const sizes: Record<Size, string> = {
  sm: 'text-sm px-3 py-1.5 gap-1.5',
  md: 'text-base px-4 py-2 gap-2',
  lg: 'text-lg px-6 py-3 gap-2'
};

// The mechanic -- pop, depress, sink. default extrudes on a hard bottom edge in
// the fill's own dark shade; flat is a quieter intent-tied border. Both drive
// off --btn-edge.
const variants: Record<Variant, string> = {
  default:
    'shadow-[0_7px_0_0_var(--btn-edge),0_8px_8px_0_rgba(0,0,0,0.4)] ' +
    'hover:enabled:translate-y-[3px] hover:enabled:shadow-[0_4px_0_0_var(--btn-edge),0_5px_6px_0_rgba(0,0,0,0.4)] hover:enabled:brightness-[1.08] ' +
    'active:enabled:translate-y-[7px] active:enabled:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.5)] active:enabled:brightness-95 ' +
    'disabled:translate-y-[3px] disabled:shadow-[0_4px_0_0_var(--btn-edge)]',
  flat:
    'border-[3px] border-solid border-[color:var(--btn-edge)] ' +
    'hover:enabled:brightness-[1.08] ' +
    'active:enabled:translate-y-[2px] active:enabled:brightness-95'
};

// Each intent supplies the fill, the text colour, and its own dark edge (the
// skeuomorphic "side"). The mechanic above is the same for every intent,
// driven off these three vars.
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
    // the fill is already dark, so a darker "side" vanishes into the canvas;
    // the structural border colour is the visible neutral edge.
    '--btn-fg': 'var(--color-fg-default)',
    '--btn-edge': 'var(--color-border-default)'
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

const classes = computed(() => [base, sizes[props.size], variants[props.variant]]);
</script>

<template>
  <button :type="type" :disabled="disabled" :class="classes" :style="intentVars[intent]">
    <slot />
  </button>
</template>
