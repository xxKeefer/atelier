import { defineComponent } from 'vue'
import { brands, brandColumnLabels } from '../data'

// The three brand rows: primary, secondary, neutral, columned by surface ramp +
// border tiers + edge + fg. Neutral has no edge token (no lit fill to shadow), so
// that cell renders empty rather than a fake substitute -- see data.ts for why.
export const BrandView = defineComponent({
  setup: () => ({ brands, brandColumnLabels }),
  template: `
    <div class="flex w-max flex-col gap-3 text-fg-default">
      <div class="flex items-center gap-3 pl-24">
        <span v-for="label in brandColumnLabels" :key="label" class="w-24 text-center font-mono text-fg-subtle text-xs">{{ label }}</span>
      </div>
      <div v-for="brand in brands" :key="brand.name" class="flex items-center gap-3">
        <span class="w-24 shrink-0 font-mono text-sm">{{ brand.name }}</span>
        <div
          v-for="col in brand.columns"
          :key="col.label"
          class="flex h-12 w-24 items-center justify-center rounded-md"
          :class="col.kind === 'none' ? '' : col.kind === 'text' ? col.class : col.kind === 'border' ? ['bg-transparent border-2', col.class] : ['border border-border-default', col.class]"
        >
          <span v-if="col.kind === 'text'" class="text-xs">Aa</span>
        </div>
      </div>
    </div>
  `,
})
