import { composeStories } from '@storybook/vue3-vite'
import { render, screen } from '@testing-library/vue'
import { expect, test } from 'vitest'
import { defineComponent } from 'vue'
import List from './AtList.vue'
import ListItem from './AtListItem.vue'
import * as stories from './AtList.stories'
import { snapBoard } from '../../test/snap'

const { Snapshot } = composeStories(stories)

const ThreeItemList = defineComponent({
  components: { List, ListItem },
  props: { variant: { type: String, default: undefined } },
  template: `
    <List :variant="variant">
      <ListItem>Apple</ListItem>
      <ListItem>Banana</ListItem>
      <ListItem>Cherry</ListItem>
    </List>
  `,
})

// Default variant renders an unordered (bulleted) list.
test('renders a bulleted list as a <ul> by default', () => {
  render(ThreeItemList)
  const list = screen.getByRole('list')
  expect(list.tagName).toBe('UL')
})

// variant="numbered" renders an ordered list.
test('renders a numbered list as an <ol>', () => {
  render(ThreeItemList, { props: { variant: 'numbered' } })
  const list = screen.getByRole('list')
  expect(list.tagName).toBe('OL')
})

// AT exposes each ListItem as a listitem, and arbitrary content (here, a
// nested component alongside text) passes through the item's slot untouched.
test('renders arbitrary slot content per item and exposes the correct item count', () => {
  const Glyph = defineComponent({
    template: `<span data-testid="glyph" />`,
  })
  const MixedContentList = defineComponent({
    components: { List, ListItem, Glyph },
    template: `
      <List>
        <ListItem><Glyph /> Apple</ListItem>
        <ListItem>Banana</ListItem>
      </List>
    `,
  })
  render(MixedContentList)
  expect(screen.getAllByRole('listitem')).toHaveLength(2)
  expect(screen.getByTestId('glyph')).toBeInTheDocument()
  expect(screen.getByText('Banana')).toBeInTheDocument()
})

// The single visual snap for List: the Snapshot story's board.
// Baseline: __snaps__/list-chromium-linux.png. Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'list')
})
