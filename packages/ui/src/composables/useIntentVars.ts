import { computed, type Ref } from 'vue'
import { STATUS_INTENT_TOKENS, type StatusIntent } from '../constants/intents'

// Resolves STATUS_INTENT_TOKENS into a `--{prefix}-*` CSS custom-property map.
// Shared by AtAlert and AtToast (and any future tinted status surface) so the
// bg/border/fg -> --{prefix}-bg/border/fg mapping lives in one place.
export function useIntentVars(prefix: string, intent: Ref<StatusIntent>) {
  return computed(() => {
    const tokens = STATUS_INTENT_TOKENS[intent.value]
    return {
      [`--${prefix}-bg`]: tokens.bg,
      [`--${prefix}-border`]: tokens.border,
      [`--${prefix}-fg`]: tokens.fg,
    }
  })
}
