import { defineComponent } from 'vue'
import Toast from '../AtToast.vue'

export const intents = ['info', 'success', 'warning', 'danger'] as const

// Every intent, on canvas -- the colour + icon role matrix.
export const IntentsView = defineComponent({
  components: { Toast },
  setup: () => ({ intents }),
  template: `
    <div class="flex w-96 flex-col gap-4">
      <Toast v-for="intent in intents" :key="intent" :intent="intent">
        A {{ intent }} notification message.
      </Toast>
    </div>
  `,
})
