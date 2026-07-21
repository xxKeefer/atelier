import { defineComponent } from 'vue'
import Toast from '../AtToast.vue'

// showClose=false -- a wrapper managing an auto-dismiss timer (e.g.
// AtToastProvider) suppresses the close button. Contrasts with the other
// views, which all omit `showClose` and so show it by default.
export const NoCloseView = defineComponent({
  components: { Toast },
  template: `
    <Toast intent="success" :show-close="false" class="w-96">
      Auto-dismisses after a delay, no close button.
    </Toast>
  `,
})
