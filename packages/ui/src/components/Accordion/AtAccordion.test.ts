import { composeStories } from '@storybook/vue3-vite'
import { render, screen } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { expect, test } from 'vitest'
import Accordion from './AtAccordion.vue'
import AccordionItem from './AtAccordionItem.vue'
import * as stories from './AtAccordion.stories'
import { snapBoard } from '../../test/snap'

const { Snapshot } = composeStories(stories)

// Clicking a closed trigger opens it, flipping its own aria-expanded --
// reka-ui's data-state, not a locally tracked open flag.
test('clicking a trigger opens its item', async () => {
  render(Accordion, {
    slots: {
      default: '<AccordionItem value="a" label="First">Content A</AccordionItem>',
    },
    global: { components: { AccordionItem } },
  })
  const trigger = screen.getByRole('button', { name: 'First' })
  expect(trigger).toHaveAttribute('aria-expanded', 'false')
  await userEvent.click(trigger)
  expect(trigger).toHaveAttribute('aria-expanded', 'true')
})

// type="single" (the default): opening one item closes whichever was open --
// only one aria-expanded=true at a time.
test('single type keeps at most one item open', async () => {
  render(Accordion, {
    props: { type: 'single' },
    slots: {
      default: `
        <AccordionItem value="a" label="First">Content A</AccordionItem>
        <AccordionItem value="b" label="Second">Content B</AccordionItem>
      `,
    },
    global: { components: { AccordionItem } },
  })
  await userEvent.click(screen.getByRole('button', { name: 'First' }))
  await userEvent.click(screen.getByRole('button', { name: 'Second' }))
  expect(screen.getByRole('button', { name: 'First' })).toHaveAttribute('aria-expanded', 'false')
  expect(screen.getByRole('button', { name: 'Second' })).toHaveAttribute('aria-expanded', 'true')
})

// type="multiple": every item toggles independently.
test('multiple type allows more than one item open at once', async () => {
  render(Accordion, {
    props: { type: 'multiple' },
    slots: {
      default: `
        <AccordionItem value="a" label="First">Content A</AccordionItem>
        <AccordionItem value="b" label="Second">Content B</AccordionItem>
      `,
    },
    global: { components: { AccordionItem } },
  })
  await userEvent.click(screen.getByRole('button', { name: 'First' }))
  await userEvent.click(screen.getByRole('button', { name: 'Second' }))
  expect(screen.getByRole('button', { name: 'First' })).toHaveAttribute('aria-expanded', 'true')
  expect(screen.getByRole('button', { name: 'Second' })).toHaveAttribute('aria-expanded', 'true')
})

// A disabled item's trigger renders as a real native disabled button -- a
// browser refuses to click it at all, which is the enforcement itself.
test('a disabled item renders its trigger disabled and closed', () => {
  render(Accordion, {
    slots: {
      default: '<AccordionItem value="a" label="Unavailable" disabled>Content A</AccordionItem>',
    },
    global: { components: { AccordionItem } },
  })
  const trigger = screen.getByRole('button', { name: 'Unavailable' })
  expect(trigger).toBeDisabled()
  expect(trigger).toHaveAttribute('aria-expanded', 'false')
})

// Content and trigger relation: AccordionContent renders role="region" with
// aria-labelledby pointing at its trigger's id (reka-ui wires this, not us) --
// so assistive tech announces the section by its trigger's label when the
// content area receives focus.
test('the content region is labelled by its trigger', () => {
  render(Accordion, {
    props: { type: 'single', modelValue: 'a' },
    slots: {
      default: '<AccordionItem value="a" label="First section">Content A</AccordionItem>',
    },
    global: { components: { AccordionItem } },
  })
  const trigger = screen.getByRole('button', { name: 'First section' })
  const region = screen.getByRole('region', { name: 'First section' })
  expect(region).toHaveAttribute('aria-labelledby', trigger.id)
})

// The caret rotates via the trigger's own data-state, not a separate prop.
test('the caret icon flips state with the trigger', async () => {
  render(Accordion, {
    slots: {
      default: '<AccordionItem value="a" label="First">Content A</AccordionItem>',
    },
    global: { components: { AccordionItem } },
  })
  const trigger = screen.getByRole('button', { name: 'First' })
  expect(trigger).toHaveAttribute('data-state', 'closed')
  await userEvent.click(trigger)
  expect(trigger).toHaveAttribute('data-state', 'open')
})

// The #trigger slot overrides the plain text label for richer header content.
test('the #trigger slot renders in place of the label prop', () => {
  render(Accordion, {
    slots: {
      default: `
        <AccordionItem value="a">
          <template #trigger>Custom trigger</template>
          Content A
        </AccordionItem>
      `,
    },
    global: { components: { AccordionItem } },
  })
  expect(screen.getByRole('button', { name: 'Custom trigger' })).toBeInTheDocument()
})

// The single visual snap for Accordion: the Snapshot story's board.
// Baseline: __snaps__/accordion-chromium-linux.png. Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'accordion')
})
