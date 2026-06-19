# Atelier

A personal design system and Vue component library, built in public.

Tokens are the source of truth, Tailwind v4 consumes them, Reka components are styled on top.

## Packages

- [`@atelier/tokens`](packages/tokens) -- surface-agnostic design language (DTCG JSON, compiled with Style Dictionary). Emits CSS custom properties + TS types.
- [`@atelier/ui`](packages/ui) -- Vue 3 component library on reka-ui primitives, styled via the tokens through Tailwind v4.
- [`docs`](packages/docs) -- the public documentation site (VitePress).

## Develop

```sh
pnpm install
pnpm build      # build all packages
pnpm dev        # watch all packages
pnpm test       # run tests
pnpm typecheck  # typecheck all packages
```

## License

MIT
