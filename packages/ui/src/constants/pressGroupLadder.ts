// The 3-rung "grouped control" press ladder shared by AtButtonGroupItem and
// AtTabsTrigger: rest sits at `higher`, hover presses to `high`, the
// checked/active member depresses to `low` and stays. The two reka-ui
// primitives key the same rungs off different data-state vocabularies;
// press-group-higher/-high/-low already match both spellings in one utility,
// so this module only composes the enabled/hover/disabled variant chain.
//
// Neutral only -- there is no danger colourway for grouped controls today.

export function pressGroupLadder(): string {
  return [
    'enabled:press-group-higher',
    'hover:enabled:press-group-high',
    'enabled:press-group-low',
    // Disabled state was never state-split in the original chains -- flat,
    // no lift, regardless of checked/active -- so it composes plain token
    // utilities rather than a press-group-* rung.
    'disabled:opacity-50 disabled:shadow-flat disabled:translate-y-0',
  ].join(' ')
}
