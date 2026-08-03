import { defineComponent } from 'vue'
import Badge from '../AtBadge.vue'
import { intents, variants } from './shared'

// Every intent, both variants: the solid chip (Button's fill shape) beside the
// faded chip (Alert's tinted-panel shape), so the two read as clearly distinct
// at the same intent.
export const VariantsView = defineComponent({
  components: { Badge },
  setup: () => ({ intents, variants }),
  template: `
    <div class="flex flex-col gap-3">
      <div v-for="variant in variants" :key="variant" class="flex items-center gap-3">
        <span class="w-12 font-body text-fg-subtle text-xs">{{ variant }}</span>
        <Badge v-for="intent in intents" :key="intent" :intent="intent" :variant="variant">
          {{ intent }}
        </Badge>
      </div>
    </div>
  `,
})
