import { defineComponent } from 'vue'
import { PhStar } from '@phosphor-icons/vue'
import Icon from '../AtIcon.vue'

export const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const

// One glyph at every named size -- each maps to a type-scale step so icons line
// up with the text they sit beside.
export const SizesView = defineComponent({
  components: { Icon },
  setup: () => ({ sizes, icon: PhStar }),
  template: `
    <div class="flex items-end gap-4 text-fg-default">
      <div v-for="size in sizes" :key="size" class="flex flex-col items-center gap-1">
        <Icon :icon="icon" :size="size" />
        <span class="font-body text-fg-subtle text-xs">{{ size }}</span>
      </div>
    </div>
  `,
})
