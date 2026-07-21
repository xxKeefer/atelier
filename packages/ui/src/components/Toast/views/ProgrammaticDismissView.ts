import { defineComponent } from 'vue'
import ToastProvider from '../AtToastProvider.vue'
import Button from '../../Button/AtButton.vue'
import { useToast } from '../useToast'

// dismiss(id) lets calling code close a specific toast programmatically --
// e.g. an async action resolving and clearing its own progress toast.
export const ProgrammaticDismissView = defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names
  components: { ToastProvider, Button },
  setup: () => {
    const { toast, dismiss } = useToast()
    let pendingId: number | null = null
    return {
      fire: () => {
        pendingId = toast({ intent: 'info', message: 'Processing...', timeout: null })
      },
      resolve: () => {
        if (pendingId !== null) dismiss(pendingId)
        pendingId = null
      },
    }
  },
  template: `
    <div class="flex flex-col gap-4">
      <p class="max-w-sm text-sm text-fg-muted">
        Fire a permanent toast, then dismiss it by id from outside the toast
        itself -- no close button needed.
      </p>
      <div class="flex gap-2">
        <Button @click="fire">Start task</Button>
        <Button variant="flat" @click="resolve">Resolve task</Button>
      </div>
      <ToastProvider />
    </div>
  `,
})
