import { composeStories } from '@storybook/vue3-vite'
import { render, screen } from '@testing-library/vue'
import { expect, test } from 'vitest'
import AvatarGroup from './AtAvatarGroup.vue'
import * as stories from './AtAvatarGroup.stories'
import { snapBoard } from '../../test/snap'

const { Snapshot } = composeStories(stories)

test('renders every avatar when there is no max', () => {
  render(AvatarGroup, {
    props: { avatars: [{ initials: 'AT' }, { initials: 'BK' }, { initials: 'CD' }] },
  })
  expect(screen.getByText('AT')).toBeInTheDocument()
  expect(screen.getByText('BK')).toBeInTheDocument()
  expect(screen.getByText('CD')).toBeInTheDocument()
})

test('collapses avatars beyond max into a +N overflow avatar', () => {
  render(AvatarGroup, {
    props: {
      avatars: [{ initials: 'AT' }, { initials: 'BK' }, { initials: 'CD' }, { initials: 'DE' }],
      max: 2,
    },
  })
  expect(screen.getByText('AT')).toBeInTheDocument()
  expect(screen.getByText('BK')).toBeInTheDocument()
  expect(screen.queryByText('CD')).not.toBeInTheDocument()
  expect(screen.getByText('+2')).toBeInTheDocument()
})

test('does not render an overflow avatar when avatars fit within max', () => {
  render(AvatarGroup, {
    props: { avatars: [{ initials: 'AT' }, { initials: 'BK' }], max: 3 },
  })
  expect(screen.queryByText(/^\+/)).not.toBeInTheDocument()
})

test('exposes an accessible group label', () => {
  render(AvatarGroup, {
    props: { avatars: [{ initials: 'AT' }], label: 'Project collaborators' },
  })
  expect(screen.getByRole('group', { name: 'Project collaborators' })).toBeInTheDocument()
})

test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'avatar-group')
})
