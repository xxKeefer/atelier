# ADR-0004: Spacing and radius tokens

- Status: accepted
- Date: 2026-06-17

## Context

Spacing and radius families needed authoring into
`packages/tokens/src/spacing.json` as DTCG `dimension` groups (per
[[0002-token-source-of-truth-format]]).

## Decision

**Spacing: numeric, 4px (0.25rem) base.** Keys mirror Tailwind `--spacing-*`
(`0, px, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32`). Numeric
rather than t-shirt because a spacing scale needs more steps than t-shirt
names comfortably provide. Explicit values (not Tailwind's single
`--spacing` multiplier) keep the scale portable to non-web surfaces.

**Radius: t-shirt, none -> full.** `none(0), sm(4px), md(8px), lg(12px),
xl(16px), 2xl(24px), full(9999px)`. Range spans the dual aesthetic: `none`
for the neo-brutalist hard edge, mid steps for neo-skeuomorphic soft cards,
`full` for pills/avatars. `md` (8px) matches a prior project's card radius.
Default per-component radius is a component-tier decision; this family only
provides the range.

## Known issue -- kept, deferred

Fractional spacing keys (`0.5`, `1.5`, `2.5`) compile to `--spacing-0-5` etc.
(Style Dictionary replaces `.` with `-`), so they do **not** match Tailwind's
`p-0.5` utility (confirmed still present in `dist/theme.css`). Decision: keep
the half-steps anyway; fix later with a Style Dictionary name transform
rather than dropping useful steps now.

## Consequences

- Consumers reaching for `p-0.5`/`m-0.5`/etc. get Tailwind's own default
  spacing scale, not the token value, until the name-transform fix lands.
