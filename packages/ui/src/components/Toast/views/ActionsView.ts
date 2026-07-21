import { defineComponent } from 'vue'
import Toast from '../AtToast.vue'
import Button from '../../Button/AtButton.vue'

// A toast whose actions relate directly to its message -- a supplementary
// affordance to react to what it reports (e.g. undoing a just-completed
// delete), same pattern as Alert's actions slot.
export const ActionsView = defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names
  components: { Toast, Button },
  template: `
    <Toast intent="danger" class="w-96">
      Conversation deleted.
      <template #actions>
        <Button size="sm" variant="flat" intent="danger">Undo</Button>
      </template>
    </Toast>
  `,
})
