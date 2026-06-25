<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
const { t } = useI18n()
const { $api } = useNuxtApp()

useSeoMeta({ title: () => `${t('admin.nav.overview')} · Admin`, robots: 'noindex' })

interface Stats {
  users: number
  addresses: number
  support: number
  supportPending: number
  byCity: { city: string; count: number }[]
}
const { data: stats, pending, error, refresh } = await useAsyncData('admin-stats', () =>
  $api<Stats>('/admin/stats'),
)

const cards = computed(() => [
  { label: t('admin.stats.users'), value: stats.value?.users ?? 0, icon: 'lucide:users', tone: 'bg-brand-50 text-brand-500' },
  { label: t('admin.stats.addresses'), value: stats.value?.addresses ?? 0, icon: 'lucide:map-pin', tone: 'bg-success-50 text-success-600' },
  { label: t('admin.stats.support'), value: stats.value?.support ?? 0, icon: 'lucide:mail', tone: 'bg-info-50 text-info-600' },
  { label: t('admin.stats.pending'), value: stats.value?.supportPending ?? 0, icon: 'lucide:clock', tone: 'bg-warning-50 text-warning-600' },
])
const maxCity = computed(() => Math.max(1, ...(stats.value?.byCity ?? []).map((c) => c.count)))
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-bold text-text-strong">{{ t('admin.nav.overview') }}</h1>

    <UiEmptyState v-if="error" icon="lucide:cloud-off" :title="t('common.errorTitle')">
      <UiButton variant="ghost" @click="refresh()"><Icon name="lucide:refresh-cw" /> {{ t('common.retry') }}</UiButton>
    </UiEmptyState>

    <template v-else>
      <!-- KPIs -->
      <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <UiCard v-for="card in cards" :key="card.label">
          <div class="flex h-11 w-11 items-center justify-center rounded-lg" :class="card.tone">
            <Icon :name="card.icon" class="text-xl" />
          </div>
          <p class="mt-4 font-display text-3xl font-extrabold text-text-strong">
            <template v-if="pending"><UiSkeleton width="3rem" height="2rem" /></template>
            <template v-else>{{ card.value.toLocaleString('fr-FR') }}</template>
          </p>
          <p class="mt-1 text-sm text-text-muted">{{ card.label }}</p>
        </UiCard>
      </div>

      <!-- Répartition par ville -->
      <UiCard class="mt-6">
        <h2 class="font-display text-lg font-bold text-text-strong">{{ t('admin.stats.byCity') }}</h2>
        <div class="mt-5 space-y-3">
          <div v-for="row in stats?.byCity" :key="row.city" class="flex items-center gap-4">
            <span class="w-24 shrink-0 text-sm text-text-base">{{ row.city }}</span>
            <div class="h-2.5 flex-1 overflow-hidden rounded-full bg-surface-muted">
              <div class="h-full rounded-full bg-brand-500 transition-all" :style="{ width: `${(row.count / maxCity) * 100}%` }" />
            </div>
            <span class="w-10 text-right font-mono text-sm text-text-muted">{{ row.count }}</span>
          </div>
        </div>
      </UiCard>
    </template>
  </div>
</template>
