import { defineComponent } from 'vue'
import ProgressBar from '../AtProgressBar.vue'

export const StatesView = defineComponent({
  components: { ProgressBar },
  template: `
    <div class="flex flex-col gap-3">
      <ProgressBar :value="25" label="Determinate: 25%" />
      <ProgressBar :value="null" label="Indeterminate" />
      <ProgressBar :value="80" aria-label="Progress with no visible label" />
    </div>
  `,
})
