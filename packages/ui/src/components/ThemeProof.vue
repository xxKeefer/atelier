<script setup lang="ts">
defineProps<{ heading?: string }>();
</script>

<template>
  <section class="flex flex-col gap-4 max-w-prose" data-testid="snap-board">
    <h1 class="font-heading font-bold text-4xl text-fg-default">
      {{ heading ?? 'Atelier' }}
    </h1>

    <p class="font-body text-base text-fg-muted">
      Body copy in JetBrains Mono. The heading above is Atkinson Hyperlegible.
      If the fonts and tokens are wired, these read as the design system, not
      browser defaults.
    </p>

    <div class="flex gap-3">
      <span class="rounded-md bg-brand-primary-default text-brand-primary-fg px-4 py-2">
        primary
      </span>
      <span class="rounded-md bg-brand-secondary-default text-brand-secondary-fg px-4 py-2">
        secondary
      </span>
      <span class="rounded-md border border-border-default text-fg-default px-4 py-2">
        bordered
      </span>
    </div>
  </section>
</template>
