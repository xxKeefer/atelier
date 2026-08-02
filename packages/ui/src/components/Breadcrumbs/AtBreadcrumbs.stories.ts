import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Breadcrumbs from './AtBreadcrumbs.vue'
import BreadcrumbItem from './AtBreadcrumbItem.vue'
import { BasicView } from './views/BasicView'
import { IconsView } from './views/IconsView'
import { DisabledItemView } from './views/DisabledItemView'
import { CustomSeparatorView } from './views/CustomSeparatorView'

const meta = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof Breadcrumbs>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: () => ({ components: { BasicView }, template: `<BasicView />` }),
}

// Icons communicate a page's role -- opt in per item via the icon prop, not
// applied automatically to every item.
export const WithIcons: Story = {
  render: () => ({ components: { IconsView }, template: `<IconsView />` }),
}

// A disabled item cannot be navigated to, independent of its siblings.
export const WithDisabledItem: Story = {
  render: () => ({ components: { DisabledItemView }, template: `<DisabledItemView />` }),
}

export const CustomSeparator: Story = {
  render: () => ({ components: { CustomSeparatorView }, template: `<CustomSeparatorView />` }),
}

// Exercises the empty-slot / bare-item render path outside the shared views.
export const SingleItem: Story = {
  render: () => ({
    components: { Breadcrumbs, BreadcrumbItem },
    template: `
      <Breadcrumbs>
        <BreadcrumbItem current>Dashboard</BreadcrumbItem>
      </Breadcrumbs>
    `,
  }),
}

export const Snapshot: Story = {
  render: () => ({
    components: { BasicView, IconsView, DisabledItemView, CustomSeparatorView },
    template: `
      <div class="flex w-max flex-col gap-6 bg-bg-default p-6" data-testid="snap-board">
        <section class="flex flex-col gap-2">
          <h2 class="font-heading font-bold text-lg text-fg-default">Basic</h2>
          <BasicView />
        </section>
        <section class="flex flex-col gap-2">
          <h2 class="font-heading font-bold text-lg text-fg-default">Icons</h2>
          <IconsView />
        </section>
        <section class="flex flex-col gap-2">
          <h2 class="font-heading font-bold text-lg text-fg-default">Disabled item</h2>
          <DisabledItemView />
        </section>
        <section class="flex flex-col gap-2">
          <h2 class="font-heading font-bold text-lg text-fg-default">Custom separator</h2>
          <CustomSeparatorView />
        </section>
      </div>
    `,
  }),
}
