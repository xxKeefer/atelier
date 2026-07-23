# ADR-0007: Button elevation mechanic (and two gotchas that cost a day)

- Status: accepted
- Date: 2026-06-29

## Context

`AtButton`'s default variant needed to consume the elevation tokens
([[0005-elevation-motion-tokens]]) rather than hand-rolled shadow values.
Wiring it up surfaced two non-obvious constraints that generalise to any
token-driven press/lift animation.

## Decision

The default variant rests popped and presses flush. Every state rides the
`shadow` + `lift` tokens; no hand-rolled shadow values.

| State  | Shadow token                        | Lift translate                    | Reads as        |
| ------ | ----------------------------------- | --------------------------------- | --------------- |
| rest   | `shadow-{intent}-higher` (4px edge) | `-translate-y-lift-full` (4px up) | popped          |
| hover  | `shadow-{intent}-high` (2px edge)   | `-translate-y-lift-half` (2px up) | presses halfway |
| active | `shadow-{intent}-low` (inset)       | `translate-y-0`                   | flush, sunk in  |

The coloured edge is per-intent, so the shadow class can't live in the
shared variant string -- it sits in an `intentShadows` map keyed by intent
(`packages/ui/src/components/Button/AtButton.vue`). neutral takes the plain
`shadow-higher/high/low` ladder; the rest take their colourway's hue-matched
edge tokens from the generated set in
[[0005-elevation-motion-tokens]]. Tailwind only scans literals, so every
utility is spelled out in the map.

## Gotcha 1 -- the pin invariant: lift MUST equal the shadow offset

The edge's bottom stays planted only because the upward translate cancels
the downward shadow at every rung: `base = translate_up - shadow_down`. For
the base to pin to the flat baseline, **lift == shadow offset, exactly, per
rung**: `lift-half` (2px) <-> `shadow-*-high` (2px); `lift-full` (4px) <->
`shadow-*-higher` (4px).

If they drift apart the base floats off the baseline and the button looks
like its bottom edge "sucks up." This bit hard once: a shadow-offset rescale
moved the token source values, but the **built** `theme.css` (and the
consuming `atelier-ui.css` bundle) still carried the pre-rescale lift
values. The button lifted more than the edge filled -- base sitting above
flat.

Lesson: after any token value change, rebuild **both** outputs
(`pnpm --filter @atelier/tokens build`) AND the consuming bundle
(`pnpm --filter @atelier/ui build`), then **restart Vite/Storybook** -- it
caches the imported `@atelier/tokens/theme.css` from the workspace dep and
serves stale values across a plain hot-reload. A green snapshot test does
not catch this: the snapshot renders the resting state only, where the base
happens to sit right regardless.

## Gotcha 2 -- a Tailwind `shadow-*` utility cannot be transitioned

With lift and shadow correctly paired the static endpoints were perfect, but
the hover _transition_ desynced: the shadow snapped from 4px to 2px
instantly while the button drifted down over 120ms -- "shadow sucks up, then
the cap moves."

Cause: Tailwind drives `box-shadow` through the `--tw-shadow` custom
property, registered with `syntax: "*"`, which is **not interpolable** -- so
`box-shadow` can never tween; it snaps on class swap. But `--tw-translate-y`
is registered as a `<length>`, so `translate` _does_ tween. Same
`transition` list, only one side animates -> the base unpins mid-transition.

Fix: transition **only `filter`** (the brightness glow). Drop `transform`
and `box-shadow` from the list so the geometry snaps as one unit -- translate
and shadow flip on the same frame, base pinned at every instant. The rung
change is instant and crisp; only the glow eases.

### Consequence: no smooth lift motion while the edge is a shadow utility

This kills the "lift to greet the cursor" easing the `--ease-spring` token
was authored for. It's a hard constraint, not a tuning choice: a
`shadow-*` utility can't be smoothly tweened. Restoring geometric motion
requires the edge to stop being a `box-shadow` and become an animatable
surface -- a pseudo-element or a real bottom layer sized with an
interpolable `<length>` -- so edge-height and translate can tween together.
That's a redesign of the button's edge, tracked as its own future task, not
covered here.

## Consequences

- Any new component consuming the elevation ladder for a press/lift
  interaction inherits both constraints: keep lift and shadow offsets in
  lockstep, and never put `box-shadow` in a `transition` list expecting it
  to tween.
