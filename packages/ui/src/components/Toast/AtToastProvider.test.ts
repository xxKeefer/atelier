import { render, screen } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { beforeEach, expect, test, vi } from 'vitest'
import AtToastProvider from './AtToastProvider.vue'
import { useToast } from './useToast'

// The queue is module-scoped (shared across every useToast() caller), so each
// test clears it out rather than getting a fresh module instance -- see the
// same note in useToast.test.ts.
beforeEach(() => {
  const { queue } = useToast()
  queue.splice(0, queue.length)
})

test('renders a queued toast', async () => {
  const { toast } = useToast()
  toast({ intent: 'info', message: 'Saved' })
  render(AtToastProvider)
  expect(await screen.findByText('Saved')).toBeInTheDocument()
})

test('shows at most 3 toasts, queuing the rest', async () => {
  const { toast } = useToast()
  toast({ intent: 'info', message: 'One' })
  toast({ intent: 'info', message: 'Two' })
  toast({ intent: 'info', message: 'Three' })
  toast({ intent: 'info', message: 'Four' })
  render(AtToastProvider)
  await screen.findByText('One')
  expect(screen.getAllByTestId('toast-root')).toHaveLength(3)
  expect(screen.queryByText('Four')).not.toBeInTheDocument()
})

test('promotes the oldest queued toast into view once a visible one is dismissed', async () => {
  const { toast, dismiss } = useToast()
  const first = toast({ intent: 'info', message: 'One' })
  toast({ intent: 'info', message: 'Two' })
  toast({ intent: 'info', message: 'Three' })
  toast({ intent: 'info', message: 'Four' })
  render(AtToastProvider)
  await screen.findByText('One')
  dismiss(first)
  await vi.waitFor(() => expect(screen.getByText('Four')).toBeInTheDocument())
})

test('a permanent toast (default for non-success intents) shows a close button', async () => {
  const { toast } = useToast()
  toast({ intent: 'info', message: 'Body' })
  render(AtToastProvider)
  expect(await screen.findByTestId('toast-close')).toBeInTheDocument()
})

test('a success toast, defaulting to a 5000ms timeout, omits the close button', async () => {
  const { toast } = useToast()
  toast({ intent: 'success', message: 'Done' })
  render(AtToastProvider)
  await screen.findByText('Done')
  expect(screen.queryByTestId('toast-close')).not.toBeInTheDocument()
})

test('dismiss(id) removes the matching toast', async () => {
  const { toast, dismiss } = useToast()
  const id = toast({ intent: 'info', message: 'Body' })
  render(AtToastProvider)
  await screen.findByText('Body')
  dismiss(id)
  await vi.waitFor(() => expect(screen.queryByText('Body')).not.toBeInTheDocument())
})

test('clicking a toast close button dismisses it from the queue', async () => {
  const { toast, queue } = useToast()
  toast({ intent: 'info', message: 'Body' })
  render(AtToastProvider)
  await userEvent.click(await screen.findByTestId('toast-close'))
  await vi.waitFor(() => {
    expect(queue).toHaveLength(0)
  })
})

test('hovering the viewport pauses an in-flight timeout past its original deadline', async () => {
  const { toast } = useToast()
  toast({ intent: 'success', message: 'Done' })
  render(AtToastProvider)
  await screen.findByText('Done')
  const viewport = screen.getByTestId('toast-viewport')

  vi.useFakeTimers()
  await vi.advanceTimersByTimeAsync(2000)
  viewport.dispatchEvent(new PointerEvent('pointermove', { bubbles: true }))
  await vi.advanceTimersByTimeAsync(3000)

  expect(screen.getByText('Done')).toBeInTheDocument()
  vi.useRealTimers()
})
