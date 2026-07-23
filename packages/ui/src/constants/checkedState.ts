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

// Each state's rung: unchecked rests at `high` and hovers to `flat`; checked
// depresses to `low`; indeterminate sits at `flat` (no depth cue). Enabled
// and disabled compose the same rung utilities under different variants --
// disabled never applies the hover rung.
const NEUTRAL_ENABLED: CheckedStateRows = {
  unchecked:
    'data-[state=unchecked]:enabled:press-high hover:enabled:data-[state=unchecked]:press-flat',
  checked: 'data-[state=checked]:enabled:press-low',
  indeterminate: 'data-[state=indeterminate]:enabled:press-flat',
}

const NEUTRAL_DISABLED: CheckedStateRows = {
  unchecked: 'disabled:data-[state=unchecked]:press-high',
  checked: 'disabled:data-[state=checked]:press-low',
  indeterminate: 'disabled:data-[state=indeterminate]:press-flat',
}

const DANGER_ENABLED: CheckedStateRows = {
  unchecked:
    'data-[state=unchecked]:enabled:press-danger-high hover:enabled:data-[state=unchecked]:press-danger-flat',
  checked: 'data-[state=checked]:enabled:press-danger-low',
  indeterminate: 'data-[state=indeterminate]:enabled:press-danger-flat',
}

const DANGER_DISABLED: CheckedStateRows = {
  unchecked: 'disabled:data-[state=unchecked]:press-danger-high',
  checked: 'disabled:data-[state=checked]:press-danger-low',
  indeterminate: 'disabled:data-[state=indeterminate]:press-danger-flat',
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
