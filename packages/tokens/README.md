# @atelier/tokens

The Atelier design language as a surface-agnostic source of truth.

Tokens are authored in [W3C DTCG](https://tr.designtokens.org/format/) JSON under `src/`, compiled with [Style Dictionary](https://styledictionary.com).

## Output

- `dist/tokens.css` -- CSS custom properties, consumed by Tailwind v4 `@theme`
- `dist/index.js` + `dist/index.d.ts` -- typed JS export

```sh
pnpm build   # compile tokens
pnpm dev     # watch + recompile
```

The JSON source keeps the system portable to non-web surfaces (Zed, Nix, terminal) later.
