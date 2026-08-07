import { reactive } from 'vue'
import { colorTokenFamilies, withPreservedAlpha } from './tokenList'

// Shared override state for the token playground: ControlPanelView writes to
// it, the wrapper around ProductPageView reads it to build a :style binding
// of CSS custom properties. Lives outside both views so a single instance can
// be passed to each rather than one owning the other's state.
export function useTokenOverrides() {
  const overrides = reactive<Record<string, string>>(
    Object.fromEntries(
      colorTokenFamilies.flatMap((f) => f.entries).map((e) => [e.cssVar, e.value]),
    ),
  )

  function setFromPicker(cssVar: string, originalValue: string, pickerValue: string) {
    overrides[cssVar] = withPreservedAlpha(originalValue, pickerValue)
  }

  return { overrides, setFromPicker }
}
