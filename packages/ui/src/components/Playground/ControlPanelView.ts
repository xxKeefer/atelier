import { defineComponent, reactive } from 'vue'
import { colorTokenFamilies, toPickerHex } from './tokenList'

// Renders one control per color-semantic.json leaf token, grouped by family
// (bg, surface, fg, border, primary, secondary, danger, success, warning,
// info, link) in collapsible sections. Inputs are locally reactive only --
// this slice generates the panel from real token data but does not yet wire
// edits back onto the page as live CSS-var overrides (a later slice of the
// Token Playground epic).
export const ControlPanelView = defineComponent({
  setup: () => {
    const overrides = reactive<Record<string, string>>(
      Object.fromEntries(
        colorTokenFamilies.flatMap((f) => f.entries).map((e) => [e.cssVar, e.value]),
      ),
    )
    return { families: colorTokenFamilies, overrides, toPickerHex }
  },
  template: `
    <div class="flex w-80 flex-col gap-2 bg-surface-default p-4 font-body text-fg-default" data-testid="control-panel">
      <h2 class="font-heading text-base font-bold text-fg-default">Color tokens</h2>
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
                @input="overrides[entry.cssVar] = ($event.target as HTMLInputElement).value"
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
