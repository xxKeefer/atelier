# ADR-0002: Token source-of-truth format -- DTCG JSON + Style Dictionary

- Status: accepted
- Date: 2026-06-17

## Context

`@atelier/tokens` needs a single authored source that compiles to whatever a
consuming surface needs. Web output (CSS custom properties for Tailwind v4,
TS types) is the immediate consumer, but the project's stated purpose is a
design language portable beyond the web -- Zed, Nix, terminal configs.
Authoring directly in CSS or TS would emit web output fine but locks the
system to the web and loses that portability.

## Decision

Author tokens in W3C DTCG JSON, compiled with Style Dictionary
(`packages/tokens/style-dictionary.config.js`). Default output is CSS custom
properties consumed by Tailwind v4 `@theme` (`dist/theme.css`,
`dist/tokens.css`); TS types are emitted as a second output
(`dist/index.d.ts`).

Fallback considered: if Style Dictionary fought the DTCG format during M1,
drop to a TS source that emits CSS now and JSON later. Not needed -- Style
Dictionary v5 handles DTCG JSON directly.

## Consequences

- Token source stays surface-agnostic; non-web consumers (Zed, Nix, terminal)
  can add their own Style Dictionary output format later without touching the
  source files.
- Every token family (`palette`, `typography`, `spacing`, `shadow`, `motion`,
  `color-semantic`) lives as its own DTCG JSON file under `packages/tokens/src/`.
