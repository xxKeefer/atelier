import { defineComponent } from 'vue'
import { PhInfo } from '@phosphor-icons/vue'
import Icon from '../../Icon/AtIcon.vue'
import { iconsAndText } from '../data'

// Icon/text usage examples: an icon and a text sample coloured to match the
// surface underneath, using only the fg/on-solid pairings already validated
// (contrast.test.ts) by the Status/Brand stories above.
export const IconsAndTextView = defineComponent({
  components: { Icon },
  setup: () => ({ iconsAndText, icon: PhInfo }),
  template: `
    <div class="flex w-max flex-col gap-3">
      <div
        v-for="row in iconsAndText"
        :key="row.name"
        class="flex items-center gap-3 rounded-md p-3"
        :class="[row.bg, row.tone]"
      >
        <Icon :icon="icon" size="lg" />
        <span class="font-body text-sm">{{ row.name }}</span>
      </div>
    </div>
  `,
})
