import { defineComponent } from 'vue'
import Toast from '../AtToast.vue'

// The minimal shape: no icon -- a plain tinted notification line.
export const PlainView = defineComponent({
  components: { Toast },
  template: `
    <Toast intent="info" :icon="false" class="w-96">
      A minimal toast with no icon.
    </Toast>
  `,
})
