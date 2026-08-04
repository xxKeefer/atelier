import type { Size } from '../composables/useFieldChrome'

// The text-and-padding scale shared by every text-entry field control --
// AtInput, AtTextarea, and AtSelect's trigger. Byte-identical across all
// three by design: one field feels the same size as another at the same
// `size` prop, regardless of which control it is.
export const FIELD_SIZES: Record<Size, string> = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-base px-4 py-2',
  lg: 'text-lg px-6 py-3',
}
