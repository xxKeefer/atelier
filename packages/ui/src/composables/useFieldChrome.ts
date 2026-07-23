import { computed, useId } from 'vue'

export type Size = 'sm' | 'md' | 'lg'

// The label rides one step below the field's text size, muted, on the surface.
export const labelSizes: Record<Size, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}

// Shared "messaged" field chrome: fieldId minting (a consumer-supplied id wins,
// to point an external label or aria-describedby at the field; otherwise one is
// minted) and "messaged" mode -- the field carries a label and/or a help/error
// line, reserving a fixed line of space below so toggling it never shifts the
// layout. A bare field -- no label, help, or error -- stays vertically compact,
// reserving nothing.
export function useFieldChrome(props: {
  label?: string
  help?: string
  error?: string
  id?: string
}) {
  const autoId = useId()
  const fieldId = computed(() => props.id ?? autoId)
  const messaged = computed(() => [props.label, props.help, props.error].some(Boolean))

  return { fieldId, messaged }
}
