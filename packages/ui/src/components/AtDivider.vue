<script setup lang="ts">
import { Separator } from 'reka-ui'
import { computed } from 'vue'

type Orientation = 'horizontal' | 'vertical'

const props = withDefaults(
  defineProps<{
    orientation?: Orientation
    // Decorative dividers (role=none) drop out of the a11y tree -- use when the
    // rule is pure visual garnish. The default is a real, announced separator.
    decorative?: boolean
  }>(),
  { orientation: 'horizontal', decorative: false },
)

// A bold, hard rule in the strong border token -- chunky, not a hairline, to sit
// with the skeuomorphic-brutalist weight of the rest of the system. Horizontal
// fills its row; vertical stretches its column. shrink-0 stops flex parents from
// collapsing the rule.
const classes = computed(() =>
  props.orientation === 'vertical'
    ? 'w-[3px] self-stretch shrink-0 bg-[var(--color-border-strong)]'
    : 'h-[3px] w-full shrink-0 bg-[var(--color-border-strong)]',
)
</script>

<template>
  <!-- reka's Separator owns the a11y contract: role=separator (+ aria-orientation
       when vertical) when meaningful, role=none when decorative. AtDivider is a
       styled passthrough; a consumer's fallthrough class (e.g. bg-border-subtle)
       recolours the rule. -->
  <Separator :orientation="orientation" :decorative="decorative" :class="classes" />
</template>
