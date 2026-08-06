import { defineComponent, ref, type PropType } from 'vue'
import Button from '../Button/AtButton.vue'
import {
  buildColorSemanticJson,
  colorTokenEntries,
  colorTokenFamilies,
  toPickerHex,
} from './tokenList'
import type { useTokenOverrides } from './useTokenOverrides'

// Renders one control per color-semantic.json leaf token, grouped by family
// (bg, surface, fg, border, primary, secondary, danger, success, warning,
// info, link) in collapsible sections. Overrides state is owned by the
// caller (useTokenOverrides) and passed in, so a wrapper around
// ProductPageView can read the same state to apply it as live CSS vars.
export const ControlPanelView = defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names -- registering the imported AtButton component, not defining one named that
  components: { Button },
  props: {
    overrides: {
      type: Object as PropType<ReturnType<typeof useTokenOverrides>['overrides']>,
      required: true,
    },
    setFromPicker: {
      type: Function as PropType<ReturnType<typeof useTokenOverrides>['setFromPicker']>,
      required: true,
    },
  },
  setup: (props) => {
    // "Copied!" is a timed label swap, not persistent state -- a plain ref is
    // enough, no need to route it through useTokenOverrides.
    const copied = ref(false)
    async function exportJson() {
      const json = buildColorSemanticJson({ ...props.overrides }, colorTokenEntries)
      await navigator.clipboard.writeText(JSON.stringify(json, null, 2))
      copied.value = true
      setTimeout(() => (copied.value = false), 1500)
    }
    return { families: colorTokenFamilies, toPickerHex, copied, exportJson }
  },
  template: `
    <div class="flex w-80 flex-col gap-2 bg-surface-default p-4 font-body text-fg-default" data-testid="control-panel">
      <div class="flex items-center justify-between gap-2">
        <h2 class="font-heading text-base font-bold text-fg-default">Color tokens</h2>
        <Button size="sm" variant="flat" data-testid="export-json" @click="exportJson">
          {{ copied ? 'Copied!' : 'Export JSON' }}
        </Button>
      </div>
      <p class="text-xs text-fg-subtle">One control per color-semantic.json token, grouped by family.</p>

      <details v-for="group in families" :key="group.family" class="rounded-md border border-border-default" open>
        <summary class="cursor-pointer select-none px-3 py-2 text-sm font-bold text-fg-default">
          {{ group.family }}
          <span class="font-normal text-fg-subtle">({{ group.entries.length }})</span>
        </summary>
        <div class="flex flex-col gap-3 border-t border-border-subtle p-3">
          <label
            v-for="entry in group.entries"
            :key="entry.cssVar"
            class="flex items-center justify-between gap-3 text-xs"
          >
            <span class="flex flex-col">
              <span class="font-bold text-fg-default">{{ entry.path }}</span>
              <span class="text-fg-subtle">{{ entry.cssVar }}</span>
            </span>
            <span class="flex items-center gap-2">
              <input
                type="color"
                :value="toPickerHex(overrides[entry.cssVar])"
                @input="setFromPicker(entry.cssVar, entry.value, ($event.target as HTMLInputElement).value)"
                class="h-6 w-8 cursor-pointer rounded-sm border border-border-default bg-transparent p-0"
                :aria-label="'Edit ' + entry.cssVar"
              />
              <span class="w-20 truncate text-right text-fg-subtle">{{ overrides[entry.cssVar] }}</span>
            </span>
          </label>
        </div>
      </details>
    </div>
  `,
})
