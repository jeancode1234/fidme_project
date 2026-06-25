<script setup lang="ts">
// Layout admin : barre latérale + zone de contenu. Filtres et tableaux
// seront branchés en Semaine 4.
const { t } = useI18n()
const localePath = useLocalePath()

const nav = computed(() => [
  { to: localePath('/admin'), icon: 'lucide:layout-dashboard', label: t('admin.nav.overview') },
  { to: localePath('/admin/users'), icon: 'lucide:users', label: t('admin.nav.users') },
  { to: localePath('/admin/addresses'), icon: 'lucide:map-pin', label: t('admin.nav.addresses') },
  { to: localePath('/admin/support'), icon: 'lucide:life-buoy', label: t('admin.nav.support') },
])
</script>

<template>
  <div class="flex min-h-screen bg-surface-page">
    <aside class="hidden w-64 shrink-0 flex-col border-r border-border-base bg-surface-card p-4 lg:flex">
      <NuxtLink :to="localePath('/')" class="mb-6 flex items-center gap-2 px-2">
        <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
          <Icon name="lucide:map-pin" />
        </span>
        <span class="font-display text-lg font-extrabold text-text-strong">
          find<span class="text-brand-500 dark:text-brand-300">Me</span>
        </span>
        <UiBadge tone="brand" class="ml-auto">Admin</UiBadge>
      </NuxtLink>
      <nav class="flex flex-col gap-1" :aria-label="t('admin.nav.label')">
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-base transition-colors hover:bg-surface-muted"
          active-class="bg-brand-50 text-brand-600"
        >
          <Icon :name="item.icon" class="text-lg" />
          {{ item.label }}
        </NuxtLink>
      </nav>
      <div class="mt-auto flex items-center gap-2 px-2">
        <LangSwitcher />
        <ThemeToggle />
      </div>
    </aside>

    <div class="flex min-w-0 flex-1 flex-col">
      <header class="flex h-16 items-center gap-4 border-b border-border-base bg-surface-card px-5">
        <span class="font-display font-bold text-text-strong">{{ t('admin.nav.label') }}</span>
        <UiButton :to="localePath('/dashboard')" variant="ghost" size="sm" class="ml-auto">
          <Icon name="lucide:arrow-left" /> {{ t('admin.backToApp') }}
        </UiButton>
      </header>
      <main id="main" class="flex-1 p-5 md:p-8">
        <slot />
      </main>
    </div>
    <UiToaster />
  </div>
</template>
