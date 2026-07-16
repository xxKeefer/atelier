import { defineComponent } from 'vue'
import Skeleton from '../AtSkeleton.vue'

// Composition: simple skeletons stacked into a layout approximating real
// content -- text lines, an avatar, a card -- without 1:1 mapping every
// element of the eventual UI.
export const CompositionView = defineComponent({
  components: { Skeleton },
  template: `
    <div class="flex flex-col gap-8">
      <section class="flex flex-col gap-2">
        <h2 class="font-heading font-bold text-lg">Text lines</h2>
        <div class="flex w-64 flex-col gap-2">
          <Skeleton shape="text" width="100%" height="0.875rem" />
          <Skeleton shape="text" width="100%" height="0.875rem" />
          <Skeleton shape="text" width="60%" height="0.875rem" />
        </div>
      </section>
      <section class="flex flex-col gap-2">
        <h2 class="font-heading font-bold text-lg">Avatar (circle)</h2>
        <Skeleton shape="circle" width="3rem" height="3rem" />
      </section>
      <section class="flex flex-col gap-2">
        <h2 class="font-heading font-bold text-lg">Card (rect)</h2>
        <Skeleton shape="rect" width="16rem" height="8rem" />
      </section>
    </div>
  `,
})
