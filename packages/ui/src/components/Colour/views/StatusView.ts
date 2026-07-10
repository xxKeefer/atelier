import { defineComponent } from 'vue'
import { statuses, statusColumnLabels } from '../data'

// Tier-2 semantic statuses: every status as a row, every surface/edge/text token
// as a column. Fill tokens (bg, solid, surface-*) swatch as filled boxes; border
// tokens (border, border-*, edge) swatch as outline-only boxes so the rim itself is
// what's demonstrated; fg/on-solid swatch as sample text (on-solid over its solid fill).
export const StatusView = defineComponent({
  setup: () => ({ statuses, statusColumnLabels }),
  template: `
    <div class="flex w-max flex-col gap-3 text-fg-default">
      <div class="flex items-center gap-3 pl-24">
        <span v-for="label in statusColumnLabels" :key="label" class="w-24 text-center font-mono text-fg-subtle text-xs">{{ label }}</span>
      </div>
      <div v-for="status in statuses" :key="status.name" class="flex items-center gap-3">
        <span class="w-24 shrink-0 font-mono text-sm">{{ status.name }}</span>
        <div
          v-for="col in status.columns"
          :key="col.label"
          class="flex h-12 w-24 items-center justify-center rounded-md"
          :class="col.kind === 'text' ? col.class : col.kind === 'border' ? ['bg-transparent border-2', col.class] : ['border border-border-default', col.class]"
        >
          <span v-if="col.kind === 'text'" class="text-xs">Aa</span>
        </div>
      </div>
    </div>
  `,
})
