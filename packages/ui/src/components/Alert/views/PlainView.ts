import { defineComponent } from 'vue'
import Alert from '../AtAlert.vue'

// The minimal shape: no title, no icon -- a plain tinted status line.
export const PlainView = defineComponent({
  components: { Alert },
  template: `
    <Alert intent="info" :icon="false" class="w-96">
      A minimal alert with no title and no icon.
    </Alert>
  `,
})
