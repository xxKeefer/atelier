import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Button from '../Button/AtButton.vue'
import Dropdown from './AtDropdown.vue'
import DropdownItem from './AtDropdownItem.vue'

const meta = {
  title: 'Components/Dropdown',
  component: Dropdown,
  // Fail the Vitest run on any axe violation, not just warn.
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof Dropdown>

export default meta
type Story = StoryObj<typeof meta>

// A dropdown is a menu: a list of contextual actions the trigger reveals.
export const Playground: Story = {
  render: () => ({
    components: { Dropdown, DropdownItem, Button },
    template: `
      <Dropdown>
        <template #trigger><Button>Account</Button></template>
        <DropdownItem>Profile</DropdownItem>
        <DropdownItem>Settings</DropdownItem>
        <DropdownItem disabled>Billing</DropdownItem>
        <DropdownItem>Sign out</DropdownItem>
      </Dropdown>
    `,
  }),
}

// The visual board: the menu open and anchored to the trigger, flat -- no
// elevation on the panel, each item on the surface. Baseline:
// __snaps__/dropdown-chromium-linux.png.
export const Snapshot: Story = {
  render: () => ({
    components: { Dropdown, DropdownItem, Button },
    template: `
      <div class="flex w-[480px] flex-col gap-8 bg-bg-default p-6" data-testid="snap-board">
        <section class="flex flex-col gap-4">
          <h2 class="font-heading text-lg font-bold text-fg-default">Open</h2>
          <!-- disable-teleport + transform: the popper's fixed-position
               content resolves against this ancestor instead of escaping to
               the viewport, so it lands inside the captured board. -->
          <div class="relative h-56 w-72 transform">
            <Dropdown default-open disable-teleport>
              <template #trigger><Button>Account</Button></template>
              <DropdownItem>Profile</DropdownItem>
              <DropdownItem>Settings</DropdownItem>
              <DropdownItem disabled>Billing</DropdownItem>
              <DropdownItem>Sign out</DropdownItem>
            </Dropdown>
          </div>
        </section>
      </div>
    `,
  }),
}
