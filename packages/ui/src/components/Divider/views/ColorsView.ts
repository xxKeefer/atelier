import { defineComponent } from 'vue'
import Divider from '../AtDivider.vue'

// Any bg-* utility on the fallthrough class recolours the rule. Every palette
// family a divider reaches for, each at its subtle / default / strong step. The
// token families aren't symmetric, so each maps to the closest low/mid/high it
// actually ships: border has the literal trio; brand runs subtle -> default ->
// active; status runs bg (tint) -> border -> solid (vivid).
const ramps = [
  {
    name: 'border',
    subtle: 'bg-border-subtle',
    default: 'bg-border-default',
    strong: 'bg-border-strong',
  },
  {
    name: 'primary',
    subtle: 'bg-primary-subtle',
    default: 'bg-primary-default',
    strong: 'bg-primary-active',
  },
  {
    name: 'secondary',
    subtle: 'bg-secondary-subtle',
    default: 'bg-secondary-default',
    strong: 'bg-secondary-active',
  },
  {
    name: 'danger',
    subtle: 'bg-danger-bg',
    default: 'bg-danger-border',
    strong: 'bg-danger-solid',
  },
  {
    name: 'success',
    subtle: 'bg-success-bg',
    default: 'bg-success-border',
    strong: 'bg-success-solid',
  },
  {
    name: 'warning',
    subtle: 'bg-warning-bg',
    default: 'bg-warning-border',
    strong: 'bg-warning-solid',
  },
  {
    name: 'info',
    subtle: 'bg-info-bg',
    default: 'bg-info-border',
    strong: 'bg-info-solid',
  },
] as const

const steps = ['subtle', 'default', 'strong'] as const

// Colour by Tailwind class: the rule defaults to the strong border, but any
// bg-* utility on the fallthrough class recolours it -- the border ramp
// (subtle/default/strong) plus the focus pink for emphasis.
export const ColorsView = defineComponent({
  components: { Divider },
  setup: () => ({ ramps, steps }),
  template: `
    <div class="flex w-72 flex-col gap-5 text-fg-default">
      <div v-for="ramp in ramps" :key="ramp.name" class="flex flex-col gap-2">
        <span class="font-body font-bold text-sm">{{ ramp.name }}</span>
        <div v-for="step in steps" :key="step" class="flex flex-col gap-1">
          <span class="font-body text-fg-subtle text-xs">{{ step }}</span>
          <Divider :class="ramp[step]" />
        </div>
      </div>
    </div>
  `,
})
