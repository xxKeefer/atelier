import { expect, test } from 'vitest'

// Atelier is strictly Tailwind. Component SFCs carry no <style> block -- the only
// exception would be a property Tailwind genuinely cannot express, and there is
// none today. Glob is eager+raw so every current and future component is covered.
const sources = import.meta.glob('../components/**/*.vue', {
  query: '?raw',
  import: 'default',
  eager: true,
})

for (const [path, source] of Object.entries(sources)) {
  const file = path.split('/').pop()
  if (!file) continue
  test(`no <style> block: ${file}`, () => {
    expect(source).not.toMatch(/<style[\s>]/)
  })
}
