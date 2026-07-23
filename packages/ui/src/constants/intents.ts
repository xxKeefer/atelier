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
