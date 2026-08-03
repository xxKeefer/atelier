import { computed, useId } from 'vue'

// Field id minting: a consumer-supplied id wins, so an external label or
// aria-describedby can point at the field; otherwise one is minted. Shared by
// every control that needs a stable id for its root element -- useFieldChrome
// composes this for the messaged-field family (Input/Select/Textarea); bare
// controls (Checkbox/Radio/Switch/ProgressBar) consume it directly.
export function useFieldId(props: { id?: string }) {
  const autoId = useId()
  const fieldId = computed(() => props.id ?? autoId)

  return { fieldId }
}
