import { defineComponent } from 'vue'
import ProgressBar from '../AtProgressBar.vue'

export const sizes = ['sm', 'md', 'lg'] as const

export const SizesView = defineComponent({
  components: { ProgressBar },
  setup: () => ({ sizes }),
  template: `
    <div class="flex flex-col gap-3">
      <ProgressBar
        v-for="size in sizes"
        :key="size"
        :size="size"
        :value="60"
        :label="\`Size: \${size}\`"
      />
    </div>
  `,
})
