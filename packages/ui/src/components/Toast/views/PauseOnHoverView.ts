import { defineComponent } from 'vue'
import ToastProvider from '../AtToastProvider.vue'
import Button from '../../Button/AtButton.vue'
import { useToast } from '../useToast'

// Hovering or focusing anywhere in the viewport pauses every in-flight
// timeout stack-wide, not just the one under the pointer.
export const PauseOnHoverView = defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names
  components: { ToastProvider, Button },
  setup: () => {
    const { toast } = useToast()
    const fire = () => {
      toast({ intent: 'success', message: 'Auto-dismisses in 5s -- hover the stack to pause it' })
    }
    return { fire }
  },
  template: `
    <div class="flex flex-col gap-4">
      <p class="max-w-sm text-sm text-fg-muted">
        Fire a success toast, then hover (or tab focus into) the toast stack
        before it clears -- the countdown pauses stack-wide until you move
        away.
      </p>
      <Button intent="success" @click="fire">Fire auto-dismiss toast</Button>
      <ToastProvider />
    </div>
  `,
})
