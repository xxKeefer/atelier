# ADR-0003: Typography tokens -- families, weights, scale

- Status: accepted
- Date: 2026-06-17

## Context

Typography needed font role, weight, and scale tokens authored into
`packages/tokens/src/typography.json` (DTCG groups, compiled per
[[0002-token-source-of-truth-format]]).

## Decision

**Font roles invert the original project brief.** The brief listed Atkinson
Hyperlegible as body and JetBrains Mono as mono/code. In practice the pairing
runs the other way: JetBrains Mono is the **body** face, Atkinson Hyperlegible
(bold) is the **heading/display** face -- precedent from a prior project
pairing mono body with bold-sans headings. Encoded as a thin role layer over
the primitives: `font.body -> {font.mono}`, `font.heading -> {font.sans}`.

**Weights: 400 / 700 only.** Atkinson Hyperlegible _classic_ ships Regular
and Bold only -- no medium/semibold without switching to the variable
"Atkinson Hyperlegible Next". `font-weight` exposes only `regular` (400) and
`bold` (700); not exposing weights the body face cannot render.

**No composite typography layer.** Flat primitives (`text` scale, `leading`,
`tracking`) map 1:1 onto Tailwind v4 `@theme` namespaces (`--text-*`,
`--leading-*`, `--tracking-*`). Semantic text roles (body/heading/caption
composites) are deferred to the component tier.

**Type scale: minor third (1.2), rounded to a 2px grid.** `text.xs..9xl`
(base 1rem = 16px): `0.75, 0.875, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 3.5, 4.25, 5,
6` rem. Deliberately punchier than a dense-reading major-second scale --
minor third gives headings the hit the bold/neo-brutalist aesthetic wants.
Tradeoff: no 18px step -- `lg` jumps from 16px to 20px.

## Consequences

- All typography groups mirror Tailwind v4 `@theme` namespaces, including the
  weight group (named `font-weight` so it emits `--font-weight-*`, not
  `--weight-*`).
- Any consumer wanting an intermediate font weight (500/600) is blocked until
  the body face switches to a variable font.
