import { defineComponent } from 'vue'
import ToastProvider from '../AtToastProvider.vue'
import Button from '../../Button/AtButton.vue'
import { useToast } from '../useToast'

// Queues four toasts on mount, one over the max-visible-3 cap -- "Four"
// stays queued until a visible one is dismissed, demonstrating the overflow
// promotion behaviour live.
export const QueueingView = defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names
  components: { ToastProvider, Button },
  setup: () => {
    const { toast } = useToast()
    const fill = () => {
      toast({ intent: 'info', message: 'One', timeout: null })
      toast({ intent: 'info', message: 'Two', timeout: null })
      toast({ intent: 'info', message: 'Three', timeout: null })
      toast({ intent: 'info', message: 'Four (queued past the cap)', timeout: null })
    }
    return { fill }
  },
  template: `
    <div class="flex flex-col gap-4">
      <p class="max-w-sm text-sm text-fg-muted">
        Queues four permanent toasts. Only 3 show at once -- close one to
        promote "Four" into view.
      </p>
      <Button @click="fill">Queue 4 toasts</Button>
      <ToastProvider />
    </div>
  `,
})
