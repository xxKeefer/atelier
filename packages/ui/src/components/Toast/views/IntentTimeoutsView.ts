import { defineComponent } from 'vue'
import ToastProvider from '../AtToastProvider.vue'
import Button from '../../Button/AtButton.vue'
import { useToast } from '../useToast'

// success gets a 5s auto-dismiss default; every other intent is permanent
// until closed -- buttons per intent make the contrast obvious live.
export const IntentTimeoutsView = defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names
  components: { ToastProvider, Button },
  setup: () => {
    const { toast } = useToast()
    return {
      fireSuccess: () => toast({ intent: 'success', message: 'Saved (auto-dismisses in 5s)' }),
      fireInfo: () => toast({ intent: 'info', message: 'Heads up (stays until closed)' }),
      fireWarning: () => toast({ intent: 'warning', message: 'Careful (stays until closed)' }),
      fireDanger: () => toast({ intent: 'danger', message: 'Failed (stays until closed)' }),
    }
  },
  template: `
    <div class="flex flex-col gap-4">
      <p class="max-w-sm text-sm text-fg-muted">
        success auto-dismisses after 5s; every other intent is permanent.
      </p>
      <div class="flex flex-wrap gap-2">
        <Button intent="success" @click="fireSuccess">success</Button>
        <Button intent="info" @click="fireInfo">info</Button>
        <Button intent="warning" @click="fireWarning">warning</Button>
        <Button intent="danger" @click="fireDanger">danger</Button>
      </div>
      <ToastProvider />
    </div>
  `,
})
