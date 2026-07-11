import { defineComponent } from 'vue'
import Alert from '../AtAlert.vue'

export const intents = ['info', 'success', 'warning', 'danger'] as const

// Every intent, titled, on canvas -- the colour + icon role matrix.
export const IntentsView = defineComponent({
  components: { Alert },
  setup: () => ({ intents }),
  template: `
    <div class="flex w-96 flex-col gap-4">
      <Alert
        v-for="intent in intents"
        :key="intent"
        :intent="intent"
        :title="intent.charAt(0).toUpperCase() + intent.slice(1)"
      >
        A message describing this {{ intent }} alert's context.
      </Alert>
    </div>
  `,
})
