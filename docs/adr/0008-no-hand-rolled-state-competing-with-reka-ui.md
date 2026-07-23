# ADR-0008: No hand-rolled interaction state competing with a reka-ui primitive's own

- Status: accepted
- Date: 2026-07-24

## Context

`AtDropdown.vue` hand-rolled a hover-open/close layer on top of reka-ui's `DropdownMenu`
(`OPEN_DELAY_MS`/`CLOSE_DELAY_MS` timers on `mouseenter`/`mouseleave`, see
`packages/ui/src/components/Dropdown/AtDropdown.vue`) because reka-ui's `DropdownMenu` has no
hover-open support at all -- its trigger only reacts to click, Enter, Space, and ArrowDown
(confirmed by reading `reka-ui/dist/DropdownMenu/DropdownMenuTrigger.js`). The component's own
`open` ref is bound via `v-model` to reka's `DropdownMenuRoot`, so the hand-rolled timer and
reka's own click-toggle handler (`onOpenToggle()`, synchronous, reads `open.value` at click time)
both mutate the _same_ shared state from two independent code paths with no coordination beyond
a wall-clock assumption (200ms is "long enough" for a real click's own incidental `mouseenter` to
resolve before the timer fires).

That assumption broke under the full test suite's CPU contention: the timer could fire and flip
`open` to `true` before the click was even dispatched, so reka's toggle read it as already open
and closed it -- an intermittent test flake
([[AtDropdown Test Flake -- Escape-Tab Close Under Full Suite]]) that only reproduced under load,
never standalone, and took two attempts to fix (a `mousedown`-clear attempt narrowed but didn't
close the race; a `@click.capture` handler that deterministically corrects the state immediately
before reka's own click handler runs was what actually worked -- see that card for the full
mechanism).

A codebase sweep (`grep -rln "setTimeout" packages/ui/src/components`) confirms `AtDropdown` is
the _only_ component with a hand-rolled timer competing with a reka-owned ref -- `AtTooltip`,
`AtSelect`, `AtModal`, and everything else in the library route their entire open/close/delay
logic through reka-ui's own primitives (e.g. `AtTooltip` uses reka's native
`TooltipProvider :delay-duration` for its hover delay, no hand-rolled timer at all). This is an
isolated case, not a systemic pattern -- but it's exactly the kind of thing ADR-0001 (Toast) was
meant to prevent: building parallel state/timing logic instead of checking whether reka-ui
already owns the behavior, or accepting that reka-ui doesn't support it.

## Decision

A component must never hold its own timer, flag, or ref that mutates a `v-model`-bound reka-ui
state ref (`open`, `modelValue`, etc.) on a different code path than reka's own handlers for that
ref. If a desired interaction (e.g. hover-to-open a menu) isn't natively supported by the reka-ui
primitive being used, the choice is:

1. **Don't build it** -- cut the feature rather than hand-roll competing state, if it's not load-bearing UX.
2. **If it must exist, own it through reka's own extension points** (documented events like
   `close-auto-focus`, `@keydown`, exposed context) rather than an independent `setTimeout` racing
   reka's internal read of the same ref -- and if no such extension point exists, treat that as a
   sign the primitive is the wrong fit, not a cue to work around it with more timers.

Concretely for `AtDropdown`: [[Realign AtDropdown with Reka-ui's Native Trigger Model]] tracks
removing the hand-rolled hover-open/close layer, aligning `AtDropdown`'s trigger to reka's native
click/keyboard-only model. This is a real behavior change (no more hover-to-open) that trades a
UX nicety for removing an entire class of fragile race conditions this codebase has now paid for
twice.

## Consequences

- `AtDropdown` loses hover-open/close. Any consumer relying on hovering it open needs a different
  affordance (an explicit trigger, or a genuinely reka-native primitive like `HoverCard` if the
  use case is "reveal content on hover", not "open a keyboard-navigable menu").
- Future components: before adding any interaction timing/state on top of a reka-ui primitive,
  check whether it duplicates or races state reka already owns (not just whether reka has an
  equivalent feature, per ADR-0001 -- this ADR extends that check to include _partial_ overlaps,
  where reka owns the ref but not the full behavior wanted around it).
- No CI/lint enforcement added -- this is a design-review discipline, not a mechanical rule.
  `grep -rln "setTimeout" packages/ui/src/components` is the manual check going forward when
  reviewing a new interactive component.
