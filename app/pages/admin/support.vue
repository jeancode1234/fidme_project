<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
const { t, locale } = useI18n()
const { $api } = useNuxtApp()
const toast = useToastStore()

useSeoMeta({ title: () => `${t('admin.nav.support')} · Admin`, robots: 'noindex' })

interface Msg { id: string; name: string; email: string; message: string; handled: boolean; createdAt: string }
const status = ref('')
const { data, pending, refresh } = await useAsyncData(
  'admin-support',
  () => $api<{ items: Msg[] }>('/admin/support', { query: { status: status.value } }),
)
watch(status, () => refresh())

const statusOptions = computed(() => [
  { value: '', label: t('common.all') },
  { value: 'pending', label: t('admin.support.pending') },
  { value: 'handled', label: t('admin.support.handled') },
])

async function toggle(m: Msg) {
  try {
    await $api(`/admin/support/${m.id}`, { method: 'PATCH', body: { handled: !m.handled } })
    m.handled = !m.handled
    toast.success(m.handled ? t('admin.support.handled') : t('admin.support.pending'))
    if (status.value) refresh()
  } catch (err) {
    toast.error(parseApiError(err).message)
  }
}
const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString(locale.value === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'short' })
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h1 class="font-display text-2xl font-bold text-text-strong">{{ t('admin.support.title') }}</h1>
      <div class="w-44"><UiSelect v-model="status" :options="statusOptions" :placeholder="t('admin.filterStatus')" icon="lucide:filter" /></div>
    </div>

    <div v-if="pending" class="mt-6 flex justify-center py-10"><UiSpinner /></div>
    <UiEmptyState v-else-if="!data?.items.length" icon="lucide:inbox" :title="t('admin.support.empty')" />

    <div v-else class="mt-6 space-y-3">
      <UiCard v-for="m in data.items" :key="m.id">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <p class="font-semibold text-text-strong">{{ m.name }}</p>
              <UiBadge :tone="m.handled ? 'success' : 'warning'" dot>
                {{ m.handled ? t('admin.support.handled') : t('admin.support.pending') }}
              </UiBadge>
              <span class="font-mono text-xs text-text-muted">{{ fmtDate(m.createdAt) }}</span>
            </div>
            <p class="mt-0.5 text-sm text-text-muted">{{ m.email }}</p>
            <p class="mt-2 text-sm text-text-base">{{ m.message }}</p>
          </div>
          <UiButton :variant="m.handled ? 'ghost' : 'secondary'" size="sm" @click="toggle(m)">
            <Icon :name="m.handled ? 'lucide:rotate-ccw' : 'lucide:check'" />
            {{ m.handled ? t('admin.support.markPending') : t('admin.support.markHandled') }}
          </UiButton>
        </div>
      </UiCard>
    </div>
  </div>
</template>
