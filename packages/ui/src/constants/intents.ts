import { PhChatText, PhCheckSquare, PhInfo, PhWarning, PhWarningDiamond } from '@phosphor-icons/vue'
import type { Component } from 'vue'

// The 7-value action-intent vocabulary shared by AtButton and AtSpinner.
export type Intent = 'primary' | 'secondary' | 'neutral' | 'danger' | 'success' | 'warning' | 'info'

// Button's per-intent fill, text, and edge colours (its skeuomorphic "side").
export const intentButtonVars: Record<
  Intent,
  Record<'--btn-bg' | '--btn-fg' | '--btn-edge', string>
> = {
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

// Spinner's per-intent glyph colour. Reuses Button's solid-variant status-fill
// tokens as a foreground colour since the spinner has no chip of its own to sit on.
export const intentSpinnerColors: Record<Intent, string> = {
  primary: 'var(--color-primary-default)',
  secondary: 'var(--color-secondary-default)',
  neutral: 'var(--color-fg-default)',
  danger: 'var(--color-danger-solid)',
  success: 'var(--color-success-solid)',
  warning: 'var(--color-warning-solid)',
  info: 'var(--color-info-solid)',
}

// The 5-value status-intent vocabulary shared by AtAlert, AtToast, and useToast.
// neutral is the default -- a plain notification with no status to signal.
export type StatusIntent = 'neutral' | 'info' | 'success' | 'warning' | 'danger'

// Colourblind-safe role glyph, one per status intent. Byte-identical between
// Alert and Toast before this consolidation.
export const INTENT_ICONS: Record<StatusIntent, Component> = {
  neutral: PhChatText,
  info: PhInfo,
  success: PhCheckSquare,
  warning: PhWarning,
  danger: PhWarningDiamond,
}

// Tinted-banner colour values per status intent (bg/border/fg from the status
// colour group's canvas-tint shape). Alert and Toast each bind these to their
// own CSS custom-property names (--alert-* / --toast-*) locally. neutral has
// no status colour group of its own -- it reuses the structural surface/fg/
// border tokens, the same shape Button's neutral intent draws from.
export const STATUS_INTENT_TOKENS: Record<
  StatusIntent,
  { bg: string; border: string; fg: string }
> = {
  neutral: {
    bg: 'var(--color-surface-default)',
    border: 'var(--color-border-default)',
    fg: 'var(--color-fg-default)',
  },
  info: {
    bg: 'var(--color-info-bg)',
    border: 'var(--color-info-border)',
    fg: 'var(--color-info-fg)',
  },
  success: {
    bg: 'var(--color-success-bg)',
    border: 'var(--color-success-border)',
    fg: 'var(--color-success-fg)',
  },
  warning: {
    bg: 'var(--color-warning-bg)',
    border: 'var(--color-warning-border)',
    fg: 'var(--color-warning-fg)',
  },
  danger: {
    bg: 'var(--color-danger-bg)',
    border: 'var(--color-danger-border)',
    fg: 'var(--color-danger-fg)',
  },
}
