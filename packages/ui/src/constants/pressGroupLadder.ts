// The 3-rung "grouped control" press ladder shared by AtButtonGroupItem and
// AtTabsTrigger. Both are skeuomorphic gang controls where rest sits popped
// at `higher`, hover presses halfway to `high` (+brightness), and the
// checked/active member depresses to `low` and stays there -- the depressed
// look IS the selection indicator. The two reka-ui primitives key the same
// rungs off different data-state vocabularies (RadioGroupItem's
// unchecked/checked vs Tabs' inactive/active); press-group-higher/-high/-low
// (packages/tokens/src/utilities.css) already match both spellings in one
// utility, so this module only needs to compose the enabled/hover/disabled
// variant chain, not repeat the state matching per caller.
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
