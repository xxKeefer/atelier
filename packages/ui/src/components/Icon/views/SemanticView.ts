import { defineComponent } from 'vue'
import {
  PhArrowLeft,
  PhArrowRight,
  PhArrowSquareOut,
  PhBackspace,
  PhCaretDown,
  PhChatText,
  PhCheckSquare,
  PhCircleNotch,
  PhCopy,
  PhInfo,
  PhMagnifyingGlass,
  PhMinus,
  PhPlus,
  PhQuestion,
  PhWarning,
  PhWarningDiamond,
  PhX,
} from '@phosphor-icons/vue'
import Icon from '../AtIcon.vue'

// The semantic convention: glyphs that carry a fixed meaning across Atelier, so a
// warning is always the same warning. Regular weight unless a row says otherwise.
// This story is the documentation -- the source of truth other components defer to.
const semantic = {
  Status: [
    {
      icon: PhChatText,
      name: 'Notification',
      note: 'neutral notification, no status',
      tone: '',
    },
    {
      icon: PhCheckSquare,
      name: 'Success',
      note: 'success status',
      tone: 'text-success-solid',
    },
    { icon: PhInfo, name: 'Info', note: 'informational status', tone: 'text-info-solid' },
    {
      icon: PhWarning,
      name: 'Warning',
      note: 'warning status',
      tone: 'text-warning-solid',
    },
    {
      icon: PhWarningDiamond,
      name: 'Error',
      note: 'error / danger status',
      tone: 'text-danger-solid',
    },
  ],
  Navigation: [
    { icon: PhArrowRight, name: 'Next / Forward', note: 'stepper / wizard navigation', tone: '' },
    { icon: PhArrowLeft, name: 'Back / Previous', note: 'stepper / wizard navigation', tone: '' },
    { icon: PhArrowSquareOut, name: 'External link', note: 'opens away from the app', tone: '' },
  ],
  Actions: [
    { icon: PhMagnifyingGlass, name: 'Search', note: '', tone: '' },
    { icon: PhPlus, name: 'Increment', note: '', tone: '' },
    { icon: PhMinus, name: 'Decrement', note: '', tone: '' },
    { icon: PhX, name: 'Cancel / Close', note: 'remove a draft item, close a modal', tone: '' },
    { icon: PhBackspace, name: 'Delete', note: 'destructive, no undo', tone: '' },
    { icon: PhCopy, name: 'Copy', note: '', tone: '' },
  ],
  // Neutrally coloured (no tone) -- these sit inside AtTooltipIcon triggers, not
  // status displays, so they stay unpainted regardless of the Status group above.
  'Tooltip Triggers': [
    {
      icon: PhQuestion,
      name: 'Question',
      note: 'disarms a likely "why?" or "what does this mean?" before an action',
      tone: '',
    },
    {
      icon: PhInfo,
      name: 'Info',
      note: 'extra, non-critical insight -- safe to use liberally',
      tone: '',
    },
    {
      icon: PhWarning,
      name: 'Warning',
      note: 'something to know before proceeding -- use sparingly',
      tone: '',
    },
  ],
} as const

// This story is the documentation -- the source of truth other components defer
// to. Reused wholesale (groups + loading + disclosure) by the Snapshot board.
export const SemanticView = defineComponent({
  components: { Icon },
  setup: () => ({
    semantic,
    groups: Object.keys(semantic) as (keyof typeof semantic)[],
    caret: PhCaretDown,
    spinner: PhCircleNotch,
  }),
  template: `
    <div class="flex w-max flex-col gap-8 text-fg-default">
      <section v-for="group in groups" :key="group" class="flex flex-col gap-3">
        <h2 class="font-heading font-bold text-lg">{{ group }}</h2>
        <div class="flex flex-col gap-3">
          <div v-for="row in semantic[group]" :key="row.name" class="flex items-center gap-3">
            <Icon :icon="row.icon" size="xl" :class="row.tone" />
            <span class="font-body w-40 text-base">{{ row.name }}</span>
            <span class="font-body text-fg-subtle text-sm">{{ row.note }}</span>
          </div>
        </div>
      </section>

      <section class="flex flex-col gap-3">
        <h2 class="font-heading font-bold text-lg">Loading</h2>
        <div class="flex items-center gap-3">
          <Icon :icon="spinner" size="xl" class="animate-spin" />
          <span class="font-body w-40 text-base">Loading</span>
          <span class="font-body text-fg-subtle text-sm">never static, always spinning</span>
        </div>
      </section>

      <section class="flex flex-col gap-3">
        <h2 class="font-heading font-bold text-lg">Disclosure</h2>
        <p class="font-body max-w-prose text-fg-subtle text-sm">
          One glyph, fill weight, rotated by CSS to point where the panel goes:
          down for a select (a menu sits below), up for a closing accordion, left
          and right for drawers. The icon never changes -- only its rotation.
        </p>
        <div class="flex items-center gap-6">
          <div class="flex flex-col items-center gap-1">
            <Icon :icon="caret" weight="fill" size="xl" />
            <span class="font-body text-fg-subtle text-xs">expand (select)</span>
          </div>
          <div class="flex flex-col items-center gap-1">
            <Icon :icon="caret" weight="fill" size="xl" class="rotate-180" />
            <span class="font-body text-fg-subtle text-xs">contract</span>
          </div>
          <div class="flex flex-col items-center gap-1">
            <Icon :icon="caret" weight="fill" size="xl" class="-rotate-90" />
            <span class="font-body text-fg-subtle text-xs">drawer (left)</span>
          </div>
          <div class="flex flex-col items-center gap-1">
            <Icon :icon="caret" weight="fill" size="xl" class="rotate-90" />
            <span class="font-body text-fg-subtle text-xs">drawer (right)</span>
          </div>
        </div>
      </section>
    </div>
  `,
})
