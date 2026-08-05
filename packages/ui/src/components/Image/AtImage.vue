<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { PhImageBroken } from '@phosphor-icons/vue'
import AtIcon from '../Icon/AtIcon.vue'

const props = withDefaults(
  defineProps<{
    src?: string
    // Pass "" for a purely decorative image -- an empty alt hides it from
    // assistive tech instead of falling back to the filename.
    alt: string
    width?: number | string
    height?: number | string
    // e.g. "16/9" or 1.78. With no explicit width/height, the image scales to
    // its parent's width and derives height from this ratio (CSS aspect-ratio).
    aspectRatio?: number | string
    // Native srcset density descriptors, e.g. "photo.jpg 1x, photo-2x.jpg 2x".
    // Forwarded as-is to the underlying <img> -- the browser picks the asset.
    // Meaningless for the inline-SVG path below (there's no separate asset to
    // pick), so it is ignored whenever `src` resolves to SVG.
    srcset?: string
  }>(),
  {
    src: undefined,
    width: undefined,
    height: undefined,
    aspectRatio: undefined,
    srcset: undefined,
  },
)

const toDimension = (value: number | string) =>
  typeof value === 'number' ? `${value.toString()}px` : value

const style = computed(() => ({
  width:
    props.width !== undefined
      ? toDimension(props.width)
      : props.aspectRatio !== undefined
        ? '100%'
        : undefined,
  height: props.height !== undefined ? toDimension(props.height) : undefined,
  aspectRatio: props.aspectRatio !== undefined ? String(props.aspectRatio) : undefined,
}))

const hasExplicitSize = computed(
  () => props.width !== undefined || props.height !== undefined || props.aspectRatio !== undefined,
)

// Fetched and inlined instead of rasterised via <img> so the SVG's internal paths
// stay reachable from CSS/JS (e.g. `fill="currentColor"` picking up the parent's
// text colour) -- an <img src="*.svg"> already renders vector-crisp but walls the
// markup off. Detected by extension or by the `image/svg+xml` data-URI MIME, since
// `src` is just a URL/path string with no independent content-type signal.
const isSvgSrc = computed(() => {
  if (typeof props.src !== 'string') return false
  return /^data:image\/svg\+xml/i.test(props.src) || /\.svg(?:[?#]|$)/i.test(props.src)
})

const failed = ref(false)
const svgHost = ref<HTMLElement | null>(null)
let currentSvg: SVGSVGElement | null = null

// Fetched markup is attacker-reachable if `src` ever comes from user input, so it
// is stripped of anything that can execute before insertion -- scripts,
// event-handler attributes, `javascript:` URLs, and `<foreignObject>` (which can
// embed arbitrary HTML).
function sanitizeSvg(root: SVGSVGElement) {
  root.querySelectorAll('script, foreignObject').forEach((node) => {
    node.remove()
  })
  root.querySelectorAll('*').forEach((el) => {
    for (const attr of Array.from(el.attributes)) {
      if (/^on/i.test(attr.name) || /^\s*javascript:/i.test(attr.value)) {
        el.removeAttribute(attr.name)
      }
    }
  })
}

async function loadSvg(src: string) {
  try {
    const response = await fetch(src)
    if (!response.ok) throw new Error('svg fetch failed')
    const text = await response.text()
    const doc = new DOMParser().parseFromString(text, 'image/svg+xml')
    const svg = doc.querySelector('svg')
    if (!svg || doc.querySelector('parsererror')) throw new Error('invalid svg markup')
    sanitizeSvg(svg)
    svg.setAttribute('aria-hidden', 'true')
    svg.setAttribute('focusable', 'false')
    if (hasExplicitSize.value) {
      svg.style.width = '100%'
      svg.style.height = '100%'
    }
    currentSvg = svg
    svgHost.value?.replaceChildren(svg)
    failed.value = false
  } catch {
    currentSvg = null
    failed.value = true
  }
}

watch(
  () => props.src,
  (src) => {
    failed.value = false
    currentSvg = null
    if (src && isSvgSrc.value) void nextTick(() => void loadSvg(src))
  },
  { immediate: true },
)

// Keeps an already-inlined SVG in sync if width/height/aspectRatio change without
// a new src (the <img> path gets this for free via its :style binding).
watch(hasExplicitSize, (explicit) => {
  if (!currentSvg) return
  currentSvg.style.width = explicit ? '100%' : ''
  currentSvg.style.height = explicit ? '100%' : ''
})

const showFallback = computed(() => !props.src || failed.value)
</script>

<template>
  <img
    v-if="!showFallback && !isSvgSrc"
    :src="src"
    :srcset="srcset"
    :alt="alt"
    class="block object-cover"
    :style="style"
    @error="failed = true"
  />
  <div
    v-else-if="!showFallback"
    ref="svgHost"
    role="img"
    :aria-label="alt || undefined"
    class="block"
    :style="style"
  />
  <div
    v-else
    class="flex items-center justify-center border-thick bg-surface-subtle text-fg-subtle"
    :style="style"
    role="img"
    :aria-label="alt || undefined"
  >
    <AtIcon :icon="PhImageBroken" size="lg" />
  </div>
</template>
