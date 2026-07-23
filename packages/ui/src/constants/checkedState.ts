// The neutral/danger checked-state ladder shared by AtCheckbox and AtRadio.
// Both are skeuomorphic controls keyed by reka-ui's data-state: unchecked
// rests popped at `high`, hovering flattens to `flat`, checked depresses to
// `low`. Checkbox additionally has an indeterminate state (flat, no depth
// cue); Radio has none, so callers pass only the states they support.
//
// AtSwitch has a materially different shape (no danger colourway, no
// indeterminate) and does not consume this table.

export type CheckedStateKey = 'unchecked' | 'checked' | 'indeterminate'

type CheckedStateRows = Record<CheckedStateKey, string>

const NEUTRAL_ENABLED: CheckedStateRows = {
  unchecked:
    'data-[state=unchecked]:enabled:-translate-y-lift-half data-[state=unchecked]:enabled:bg-surface-strong data-[state=unchecked]:enabled:border-border-strong data-[state=unchecked]:enabled:shadow-high ' +
    'hover:enabled:data-[state=unchecked]:translate-y-0 hover:enabled:data-[state=unchecked]:bg-surface-default hover:enabled:data-[state=unchecked]:border-border-default hover:enabled:data-[state=unchecked]:shadow-flat',
  checked:
    'data-[state=checked]:enabled:translate-y-0 data-[state=checked]:enabled:bg-surface-default data-[state=checked]:enabled:border-border-default data-[state=checked]:enabled:shadow-low',
  indeterminate:
    'data-[state=indeterminate]:enabled:translate-y-0 data-[state=indeterminate]:enabled:bg-surface-default data-[state=indeterminate]:enabled:border-border-default data-[state=indeterminate]:enabled:shadow-flat',
}

const NEUTRAL_DISABLED: CheckedStateRows = {
  unchecked:
    'disabled:data-[state=unchecked]:-translate-y-lift-half disabled:data-[state=unchecked]:bg-surface-strong disabled:data-[state=unchecked]:border-border-strong disabled:data-[state=unchecked]:shadow-high',
  checked:
    'disabled:data-[state=checked]:translate-y-0 disabled:data-[state=checked]:bg-surface-default disabled:data-[state=checked]:border-border-default disabled:data-[state=checked]:shadow-low',
  indeterminate:
    'disabled:data-[state=indeterminate]:translate-y-0 disabled:data-[state=indeterminate]:bg-surface-default disabled:data-[state=indeterminate]:border-border-default disabled:data-[state=indeterminate]:shadow-flat',
}

const DANGER_ENABLED: CheckedStateRows = {
  unchecked:
    'data-[state=unchecked]:enabled:-translate-y-lift-half data-[state=unchecked]:enabled:bg-danger-surface-strong data-[state=unchecked]:enabled:border-danger-border-strong data-[state=unchecked]:enabled:shadow-danger-high ' +
    'hover:enabled:data-[state=unchecked]:translate-y-0 hover:enabled:data-[state=unchecked]:bg-danger-surface-recess hover:enabled:data-[state=unchecked]:border-danger-border-default hover:enabled:data-[state=unchecked]:shadow-flat',
  checked:
    'data-[state=checked]:enabled:translate-y-0 data-[state=checked]:enabled:bg-danger-surface-recess data-[state=checked]:enabled:border-danger-border-default data-[state=checked]:enabled:shadow-danger-low',
  indeterminate:
    'data-[state=indeterminate]:enabled:translate-y-0 data-[state=indeterminate]:enabled:bg-danger-surface-recess data-[state=indeterminate]:enabled:border-danger-border-default data-[state=indeterminate]:enabled:shadow-flat',
}

const DANGER_DISABLED: CheckedStateRows = {
  unchecked:
    'disabled:data-[state=unchecked]:-translate-y-lift-half disabled:data-[state=unchecked]:bg-danger-surface-strong disabled:data-[state=unchecked]:border-danger-border-strong disabled:data-[state=unchecked]:shadow-danger-high',
  checked:
    'disabled:data-[state=checked]:translate-y-0 disabled:data-[state=checked]:bg-danger-surface-recess disabled:data-[state=checked]:border-danger-border-default disabled:data-[state=checked]:shadow-danger-low',
  indeterminate:
    'disabled:data-[state=indeterminate]:translate-y-0 disabled:data-[state=indeterminate]:bg-danger-surface-recess disabled:data-[state=indeterminate]:border-danger-border-default disabled:data-[state=indeterminate]:shadow-flat',
}

// Builds the enabled/disabled class ladder for the given colourway, scoped to
// the states the caller's control actually has (Radio omits 'indeterminate').
export function checkedStateLadder(
  colourway: 'neutral' | 'danger',
  states: CheckedStateKey[],
): string {
  const enabled = colourway === 'neutral' ? NEUTRAL_ENABLED : DANGER_ENABLED
  const disabled = colourway === 'neutral' ? NEUTRAL_DISABLED : DANGER_DISABLED
  return [
    ...states.map((state) => enabled[state]),
    'disabled:opacity-50',
    ...states.map((state) => disabled[state]),
  ].join(' ')
}
