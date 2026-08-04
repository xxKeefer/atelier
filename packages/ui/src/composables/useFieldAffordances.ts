import { computed, useSlots } from 'vue'

// The #icon/#prefix/#suffix slots are optional flanking affordances a field
// consumer drops in -- an AtIcon to mark the field's purpose, or a box for
// contextual content like a currency symbol or country flag. Detected via
// useSlots (mirrors AtButton's iconOnly check) so an unused slot costs the
// field nothing: no extra padding, no positioning context beyond what's
// already there.
export function useFieldAffordances() {
  const slots = useSlots()
  const hasIcon = computed(() => !!slots.icon)
  const hasPrefix = computed(() => !!slots.prefix)
  const hasSuffix = computed(() => !!slots.suffix)

  return { hasIcon, hasPrefix, hasSuffix }
}

// The field/trigger and its flanking affordances gang into one flush
// assembly, cassette-deck style -- each segment butted zero-gap, seam doing
// the separating instead of a visible gap. Only the whole run's outer ends
// round. `leftGuard` names whichever affordance(s) sit to this segment's left
// (AtInput's own field has none, since its icon is positioned inside rather
// than flanking; AtSelect's trigger is guarded by icon and prefix).
export function useFieldRounding(
  hasPrefix: { value: boolean },
  hasSuffix: { value: boolean },
  leftGuard?: { value: boolean },
) {
  return computed(() => [
    !(leftGuard?.value ?? hasPrefix.value) && 'rounded-l-md',
    !hasSuffix.value && 'rounded-r-md',
  ])
}
