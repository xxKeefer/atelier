import { defineComponent, ref } from 'vue'
import {
  PhBell,
  PhChartBar,
  PhCreditCard,
  PhGauge,
  PhGear,
  PhMagnifyingGlass,
  PhPlus,
  PhUsers,
} from '@phosphor-icons/vue'
import Avatar from '../Avatar/AtAvatar.vue'
import Badge from '../Badge/AtBadge.vue'
import Breadcrumbs from '../Breadcrumbs/AtBreadcrumbs.vue'
import BreadcrumbItem from '../Breadcrumbs/AtBreadcrumbItem.vue'
import Button from '../Button/AtButton.vue'
import Card from '../Card/AtCard.vue'
import Alert from '../Alert/AtAlert.vue'
import Divider from '../Divider/AtDivider.vue'
import Icon from '../Icon/AtIcon.vue'
import Input from '../Input/AtInput.vue'
import ProgressBar from '../ProgressBar/AtProgressBar.vue'
import Switch from '../Switch/AtSwitch.vue'
import Tabs from '../Tabs/AtTabs.vue'
import TabsList from '../Tabs/AtTabsList.vue'
import TabsTrigger from '../Tabs/AtTabsTrigger.vue'
import TabsContent from '../Tabs/AtTabsContent.vue'

// A believable settings/dashboard product page, assembled entirely from real
// @atelier/ui components. It exists to give the token playground's control
// panel (a later slice of this epic) plenty of real surface area -- surfaces,
// text tiers, borders, primary/secondary actions, and every status colour --
// to visibly affect. Nothing here is playground-specific; it's just a page.
const navItems = [
  { label: 'Overview', icon: PhGauge, active: true },
  { label: 'Team', icon: PhUsers, active: false },
  { label: 'Billing', icon: PhCreditCard, active: false },
  { label: 'Reports', icon: PhChartBar, active: false },
] as const

const teammates = [
  { name: 'Ada Lovelace', initials: 'AL', role: 'Owner' },
  { name: 'Grace Hopper', initials: 'GH', role: 'Admin' },
  { name: 'Alan Turing', initials: 'AT', role: 'Member' },
] as const

export const ProductPageView = defineComponent({
  components: {
    Avatar,
    Badge,
    Breadcrumbs,
    BreadcrumbItem,
    // eslint-disable-next-line vue/no-reserved-component-names -- registering the real Button component, not defining one named that
    Button,
    Card,
    Alert,
    Divider,
    Icon,
    // eslint-disable-next-line vue/no-reserved-component-names -- registering the real Input component, not defining one named that
    Input,
    ProgressBar,
    // eslint-disable-next-line vue/no-reserved-component-names -- registering the real Switch component, not defining one named that
    Switch,
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
  },
  setup: () => ({
    navItems,
    teammates,
    PhBell,
    PhMagnifyingGlass,
    PhPlus,
    PhGear,
    selectedTab: ref('general'),
    notifyEmail: ref(true),
    notifySms: ref(false),
  }),
  template: `
    <div class="flex min-h-full w-[64rem] flex-col bg-bg-canvas font-body text-fg-default" data-testid="product-page">
      <!-- Top nav -->
      <header class="flex items-center justify-between gap-4 border-b-thick border-border-default bg-surface-default px-6 py-3">
        <div class="flex items-center gap-6">
          <span class="font-heading text-lg font-bold text-fg-default">Atelier Co.</span>
          <nav class="flex items-center gap-1">
            <Button
              v-for="item in navItems"
              :key="item.label"
              :intent="item.active ? 'primary' : 'neutral'"
              :variant="item.active ? 'default' : 'flat'"
              size="sm"
            >
              <template #left><Icon :icon="item.icon" size="sm" /></template>
              {{ item.label }}
            </Button>
          </nav>
        </div>
        <div class="flex items-center gap-3">
          <Input aria-label="Search" placeholder="Search…" class="w-48">
            <template #icon><Icon :icon="PhMagnifyingGlass" /></template>
          </Input>
          <Button intent="neutral" variant="flat" size="sm" aria-label="Notifications">
            <Icon :icon="PhBell" />
          </Button>
          <Avatar initials="AL" size="sm" label="Ada Lovelace" />
        </div>
      </header>

      <div class="flex flex-1 flex-col gap-6 p-6">
        <Breadcrumbs>
          <BreadcrumbItem href="#">Home</BreadcrumbItem>
          <BreadcrumbItem href="#">Settings</BreadcrumbItem>
          <BreadcrumbItem current>General</BreadcrumbItem>
        </Breadcrumbs>

        <div class="flex items-center justify-between">
          <div>
            <h1 class="font-heading text-2xl font-bold text-fg-default">Workspace settings</h1>
            <p class="mt-1 text-sm text-fg-muted">Manage your team, plan, and notification preferences.</p>
          </div>
          <div class="flex items-center gap-2">
            <Button intent="neutral" variant="flat">Cancel</Button>
            <Button intent="primary">
              <template #left><Icon :icon="PhPlus" size="sm" /></template>
              Invite teammate
            </Button>
          </div>
        </div>

        <Alert intent="warning" title="Plan usage is high">
          You're at 92% of your monthly quota. Consider upgrading before the next billing cycle.
          <template #actions>
            <Button intent="warning" size="sm">Upgrade plan</Button>
          </template>
        </Alert>

        <Tabs v-model="selectedTab">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <div class="mt-4 grid grid-cols-3 gap-6">
              <Card class="col-span-2">
                <template #header>
                  <h2 class="font-heading text-base font-bold text-fg-default">Profile</h2>
                  <Badge intent="success" variant="faded">Verified</Badge>
                </template>
                <div class="flex flex-col gap-4">
                  <Input label="Workspace name" placeholder="Acme Inc." />
                  <Input label="Support email" placeholder="support@acme.com" help="Shown on customer-facing invoices." />
                  <Divider />
                  <div class="flex flex-col gap-3">
                    <h3 class="font-heading text-sm font-bold text-fg-default">Notifications</h3>
                    <Switch v-model="notifyEmail" label="Email notifications" />
                    <Switch v-model="notifySms" label="SMS notifications" />
                  </div>
                </div>
                <template #footer>
                  <span class="text-xs text-fg-subtle">Last saved 2 minutes ago</span>
                  <Button intent="primary" size="sm">Save changes</Button>
                </template>
              </Card>

              <div class="flex flex-col gap-6">
                <Card>
                  <template #header>
                    <h2 class="font-heading text-base font-bold text-fg-default">Storage</h2>
                    <Icon :icon="PhGear" size="sm" class="text-fg-subtle" />
                  </template>
                  <div class="flex flex-col gap-2">
                    <ProgressBar :value="72" label="72 GB of 100 GB used" />
                    <p class="text-xs text-fg-subtle">Upgrade for more storage and higher limits.</p>
                  </div>
                </Card>

                <Alert intent="info" title="New feature available">
                  Bulk CSV export is now available under Reports.
                </Alert>

                <Alert intent="danger" title="Billing issue">
                  Your last payment failed. Update your card to avoid service interruption.
                </Alert>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="team">
            <Card class="mt-4">
              <template #header>
                <h2 class="font-heading text-base font-bold text-fg-default">Members</h2>
                <Badge intent="neutral" variant="faded">{{ teammates.length }} people</Badge>
              </template>
              <ul class="flex flex-col">
                <li
                  v-for="(person, index) in teammates"
                  :key="person.name"
                  class="flex items-center justify-between gap-4 py-3"
                  :class="{ 'border-b-thick border-border-subtle': index < teammates.length - 1 }"
                >
                  <div class="flex items-center gap-3">
                    <Avatar :initials="person.initials" size="sm" />
                    <div class="flex flex-col">
                      <span class="text-sm font-bold text-fg-default">{{ person.name }}</span>
                      <span class="text-xs text-fg-muted">{{ person.role }}</span>
                    </div>
                  </div>
                  <Badge :intent="person.role === 'Owner' ? 'info' : 'neutral'" variant="faded">
                    {{ person.role }}
                  </Badge>
                </li>
              </ul>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card class="mt-4">
              <template #header>
                <h2 class="font-heading text-base font-bold text-fg-default">Payment method</h2>
              </template>
              <p class="text-sm text-fg-muted">Visa ending in 4242, expires 04/27.</p>
              <template #footer>
                <Button intent="secondary" size="sm">Update card</Button>
              </template>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  `,
})
