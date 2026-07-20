import { defineComponent } from 'vue'
import Toast from '../AtToast.vue'

// A timeout is given -- the close button is suppressed, the toast dismisses
// itself. Contrasts with the other views, which all omit `timeout` and so
// show the close button by default.
export const TimeoutView = defineComponent({
  components: { Toast },
  template: `
    <Toast intent="success" :timeout="60000" class="w-96">
      Auto-dismisses after a delay, no close button.
    </Toast>
  `,
})
