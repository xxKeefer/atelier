import { reactive, type VNode } from 'vue'
import type { StatusIntent } from '../../constants/intents'

export interface ToastEntry {
  id: number
  intent: StatusIntent
  message: string
  actions?: () => VNode
  // Resolved ms delay, or null for no auto-dismiss.
  timeout: number | null
}

export interface ToastOptions {
  intent: StatusIntent
  message: string
  actions?: () => VNode
  timeout?: number | null
}

// success is disposable; every other intent needs to actually be read, so it
// stays on screen until closed.
const defaultTimeouts: Record<StatusIntent, number | null> = {
  info: null,
  success: 5000,
  warning: null,
  danger: null,
}

// Module-scoped so every useToast() caller (toast()-ing code, AtToastProvider)
// shares one queue instead of each getting its own.
const queue = reactive<ToastEntry[]>([])
let nextId = 0

function toast({ intent, message, actions, timeout }: ToastOptions): number {
  const id = nextId++
  const resolvedTimeout =
    timeout === undefined ? defaultTimeouts[intent] : timeout === 0 ? null : timeout
  queue.push({ id, intent, message, actions, timeout: resolvedTimeout })
  return id
}

function dismiss(id: number): void {
  const index = queue.findIndex((entry) => entry.id === id)
  if (index !== -1) queue.splice(index, 1)
}

export function useToast() {
  return { queue, toast, dismiss }
}
