import { defineComponent } from 'vue'
import { PhX } from '@phosphor-icons/vue'
import Card from '../AtCard.vue'
import Button from '../../Button/AtButton.vue'
import Icon from '../../Icon/AtIcon.vue'

// Header + footer: each parted from the body by a flush divider. The header
// composes a title with a close icon button at its right edge; the footer
// composes trailing action buttons.
export const HeaderAndFooterView = defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names -- registering the real Button component, not defining one named "Button"
  components: { Card, Button, Icon },
  setup: () => ({ PhX }),
  template: `
    <Card class="w-80">
      <template #header>
        <h3 class="font-heading text-lg font-bold">Settings</h3>
        <Button intent="neutral" variant="flat" size="sm" aria-label="Close">
          <template #left><Icon :icon="PhX" /></template>
        </Button>
      </template>
      <p class="text-base text-fg-muted">The body sits between the two dividers.</p>
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <Button intent="neutral" size="sm">Cancel</Button>
          <Button intent="primary" size="sm">Save</Button>
        </div>
      </template>
    </Card>
  `,
})
