import { defineComponent } from 'vue'
import Alert from '../AtAlert.vue'
import Button from '../../Button/AtButton.vue'

// An alert whose actions relate directly to its message -- a supplementary
// affordance to react to what it reports.
export const ActionsView = defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names
  components: { Alert, Button },
  template: `
    <Alert intent="warning" title="Unsaved changes" class="w-96">
      This page has unsaved changes that will be lost if you navigate away.
      <template #actions>
        <Button size="md" intent="warning">Save</Button>
        <Button size="md" variant="flat" intent="neutral">Discard</Button>
      </template>
    </Alert>
  `,
})
