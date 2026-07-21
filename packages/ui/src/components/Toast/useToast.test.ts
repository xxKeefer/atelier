import { beforeEach, describe, expect, test, vi } from 'vitest'
import { useToast } from './useToast'

// The queue is module-scoped (shared across every useToast() caller), so each
// test clears it out rather than getting a fresh module instance.
beforeEach(() => {
  const { queue } = useToast()
  queue.splice(0, queue.length)
})

describe('toast()', () => {
  test('adds an entry to the queue', () => {
    const { toast, queue } = useToast()
    toast({ intent: 'info', message: 'Saved' })
    expect(queue).toHaveLength(1)
    expect(queue[0]).toMatchObject({ intent: 'info', message: 'Saved' })
  })

  test('returns a unique id per call', () => {
    const { toast } = useToast()
    const first = toast({ intent: 'info', message: 'One' })
    const second = toast({ intent: 'info', message: 'Two' })
    expect(first).not.toBe(second)
  })

  test('every useToast() call shares the same queue', () => {
    const a = useToast()
    const b = useToast()
    a.toast({ intent: 'info', message: 'Shared' })
    expect(b.queue).toHaveLength(1)
  })

  describe('default timeout, by intent', () => {
    test('success defaults to 5000ms', () => {
      const { toast, queue } = useToast()
      toast({ intent: 'success', message: 'Done' })
      expect(queue.at(0)?.timeout).toBe(5000)
    })

    test.each(['info', 'warning', 'danger'] as const)('%s defaults to permanent', (intent) => {
      const { toast, queue } = useToast()
      toast({ intent, message: 'Body' })
      expect(queue.at(0)?.timeout).toBeNull()
    })
  })

  test('an explicit timeout overrides the intent default', () => {
    const { toast, queue } = useToast()
    toast({ intent: 'success', message: 'Done', timeout: 1000 })
    expect(queue.at(0)?.timeout).toBe(1000)
  })

  test.each([0, null] as const)(
    'explicit timeout %s forces permanent regardless of intent',
    (timeout) => {
      const { toast, queue } = useToast()
      toast({ intent: 'success', message: 'Done', timeout })
      expect(queue.at(0)?.timeout).toBeNull()
    },
  )

  test('accepts an actions render function without invoking it', () => {
    const actions = vi.fn()
    const { toast, queue } = useToast()
    toast({ intent: 'info', message: 'Undo?', actions })
    expect(queue.at(0)?.actions).toBe(actions)
    expect(actions).not.toHaveBeenCalled()
  })
})

describe('dismiss()', () => {
  test('removes the matching entry by id', () => {
    const { toast, dismiss, queue } = useToast()
    const id = toast({ intent: 'info', message: 'Body' })
    dismiss(id)
    expect(queue).toHaveLength(0)
  })

  test('leaves other entries untouched', () => {
    const { toast, dismiss, queue } = useToast()
    const first = toast({ intent: 'info', message: 'One' })
    toast({ intent: 'info', message: 'Two' })
    dismiss(first)
    expect(queue).toHaveLength(1)
    expect(queue.at(0)?.message).toBe('Two')
  })

  test('is a no-op for an unknown id', () => {
    const { toast, dismiss, queue } = useToast()
    toast({ intent: 'info', message: 'Body' })
    dismiss(999)
    expect(queue).toHaveLength(1)
  })
})
