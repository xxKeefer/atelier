# ADR-0005: Elevation and motion tokens

- Status: accepted
- Date: 2026-06-29

## Context

Elevation needed to read as tactile/physical -- inspired by Sentry's
S.C.R.A.P.S. system -- not a soft-blur drop-shadow ramp. Raised elements get
_thickness_ via a hard, no-blur bottom edge plus a soft ambient shadow;
recessed elements sink (inset).

An early pass shipped five ad-hoc shadow roles that were never a coherent
scale, plus a `color.bg` set that no surface ramp matched -- the first real
components (Card, Button, Input) bypassed the tokens entirely with
hand-rolled magic-number shadows.

## Decision

**A symmetric 5-step elevation ladder** (`packages/tokens/src/shadow.json`),
centred on a flat resting rung, paired one-to-one with a 3-step surface
colour ramp and a lift translate companion:

| Token             | Shape                      | Surface | Uses                                                  |
| ----------------- | -------------------------- | ------- | ----------------------------------------------------- |
| `--shadow-lower`  | 6px inset (deep recess)    | subtle  | inputs, wells                                         |
| `--shadow-low`    | 4px inset (shallow recess) | subtle  | selected checkbox/radio, switch track, disabled input |
| `--shadow-flat`   | no-op                      | default | prose, help/error text, flat-variant buttons          |
| `--shadow-high`   | 2px hard edge              | strong  | hovered buttons, switch thumb, static cards           |
| `--shadow-higher` | 4px hard edge              | strong  | resting default buttons                               |

`color.surface`: `subtle` / `default` / `strong` (neutral.900/800/700). A
recessed element sits on `subtle`, a lifted one on `strong`, isolating the
shadow variable from the plane colour.

`lift`: `--lift-half` (2px) and `--lift-full` (4px), equal to the `high` /
`higher` edge heights. Pressing a popped element flush translates it down by
its `lift` while the shadow drops a rung, so the element's top edge stays
put instead of appearing to rise -- see [[0007-button-elevation-mechanic]]
for the pin invariant this enables and the two gotchas that came with wiring
it up.

**Per-intent colourways are baked into the token layer, not overridden at
the component tier.** `shadow.json` carries a full `lower/low/high/higher`
ladder per semantic intent (`primary`, `secondary`, `danger`, `success`,
`warning`, `info`), each swapping the neutral edge/recess colours for a
hue-matched pair (e.g. primary: magenta.800 recess, magenta.600 edge).
`packages/ui/src/components/Elevation/data.ts` generates the six colourway
objects from a `colourwayNames` list plus a template function rather than
hand-writing each one, keeping the ramp/ladder shape from drifting between
copies. Components consume the resulting tokens directly
(`shadow-primary-higher`, `shadow-danger-high`, ...); there is no
component-tier colour override step.

**Motion:** `duration` (instant/fast/base/slow/slower -- tactile feedback is
quick, overlays slower) and `ease` (linear/in/out/in-out + `spring` with a
slight overshoot for the tactile lift). Map to Tailwind `--duration-*` /
`--ease-*`.

## Consequences

- One ladder, one surface ramp, one lift pair -- Card, Button, and the
  `Elevation` story/snapshot module all read from the same tokens instead of
  hand-rolled shadow values.
- Adding a new semantic intent means adding one entry to
  `colourwayNames` in `Elevation/data.ts`, not hand-writing a new shadow
  block -- but Tailwind only scans literal class strings, so the generated
  classes also need a literal safelist entry alongside the generator or the
  scanner won't pick them up.
- Input remains on its own hand-rolled recess (tracked separately, not part
  of this record).
