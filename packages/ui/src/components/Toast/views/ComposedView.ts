import { defineComponent } from 'vue'
import Toast from '../AtToast.vue'
import Button from '../../Button/AtButton.vue'

// The body slot accepts arbitrary markup, not just text -- here a Button,
// proving the content area composes other components.
export const ComposedView = defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names
  components: { Toast, Button },
  template: `
    <Toast intent="success" class="w-96">
      <div class="flex items-start justify-between gap-3">
        <span>File uploaded.</span>
        <Button size="sm" variant="flat" intent="success">View</Button>
      </div>
    </Toast>
  `,
})
