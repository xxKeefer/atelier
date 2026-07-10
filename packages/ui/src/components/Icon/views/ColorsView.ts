import { defineComponent } from 'vue'
import { PhWarningCircle } from '@phosphor-icons/vue'
import Icon from '../AtIcon.vue'

// Colour by token, and colour inherited from the parent. The first row paints
// the glyph with a status-colour token; the second inherits the parent's text
// colour (no color prop).
export const ColorsView = defineComponent({
  components: { Icon },
  setup: () => ({ icon: PhWarningCircle }),
  template: `
    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-4">
        <Icon :icon="icon" size="xl" color="var(--color-danger-solid)" />
        <Icon :icon="icon" size="xl" color="var(--color-warning-solid)" />
        <Icon :icon="icon" size="xl" color="var(--color-success-solid)" />
        <Icon :icon="icon" size="xl" color="var(--color-info-solid)" />
      </div>
      <div class="flex items-center gap-2 text-secondary-default">
        <Icon :icon="icon" size="xl" />
        <span class="font-body text-base">inherits the parent's colour</span>
      </div>
    </div>
  `,
})
