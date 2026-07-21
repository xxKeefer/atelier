import { defineComponent, h } from 'vue'
import ToastProvider from '../AtToastProvider.vue'
import Button from '../../Button/AtButton.vue'
import { useToast } from '../useToast'

// A toast with a supplementary action alongside its message, same shape as
// AtToast's own Actions story but fired through the real queue.
export const ActionsQueueView = defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names
  components: { ToastProvider, Button },
  setup: () => {
    const { toast } = useToast()
    const fire = () => {
      toast({
        intent: 'danger',
        message: 'Conversation deleted.',
        timeout: null,
        actions: () => h(Button, { size: 'sm', variant: 'flat', intent: 'danger' }, () => 'Undo'),
      })
    }
    return { fire }
  },
  template: `
    <div class="flex flex-col gap-4">
      <p class="max-w-sm text-sm text-fg-muted">
        A toast carrying a supplementary action button in its actions slot.
      </p>
      <Button intent="danger" @click="fire">Delete conversation</Button>
      <ToastProvider />
    </div>
  `,
})
