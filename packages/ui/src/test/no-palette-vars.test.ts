import { expect, test } from 'vitest'

// Palette is private to the token layer -- components/stories consume only
// semantic/component tokens (--color-*, --shadow-*, etc). Glob is eager+raw so
// every current and future component/story is covered.
const sources = import.meta.glob('../components/**/*.{vue,stories.ts}', {
  query: '?raw',
  import: 'default',
  eager: true,
})

for (const [path, source] of Object.entries(sources)) {
  const file = path.split('/').pop()
  if (!file) continue
  test(`no raw palette var: ${file}`, () => {
    expect(source).not.toMatch(/--palette-/)
  })
}
