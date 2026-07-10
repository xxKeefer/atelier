import { defineComponent } from 'vue'
import { PhHeart } from '@phosphor-icons/vue'
import Icon from '../AtIcon.vue'

export const weights = ['regular', 'fill'] as const

// Regular vs fill -- the two weights Atelier ships.
export const WeightsView = defineComponent({
  components: { Icon },
  setup: () => ({ weights, icon: PhHeart }),
  template: `
    <div class="flex items-center gap-6 text-fg-default">
      <div v-for="weight in weights" :key="weight" class="flex flex-col items-center gap-1">
        <Icon :icon="icon" :weight="weight" size="2xl" />
        <span class="font-body text-fg-subtle text-xs">{{ weight }}</span>
      </div>
    </div>
  `,
})
