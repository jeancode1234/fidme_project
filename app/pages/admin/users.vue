<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
const { t, locale } = useI18n()
const { $api } = useNuxtApp()

useSeoMeta({ title: () => `${t('admin.nav.users')} · Admin`, robots: 'noindex' })

interface Row {
  id: string
  fullName: string
  email: string
  addressCount: number
  createdAt: string
}
interface Res {
  items: Row[]
  total: number
  page: number
  pages: number
}

const search = ref('')
const country = ref('')
const city = ref('')
const page = ref(1)

const { data, pending, refresh } = await useAsyncData<Res>(
  'admin-users',
  () =>
    $api('/admin/users', {
      query: { search: search.value, country: country.value, city: city.value, page: page.value },
    }),
  { watch: [page] },
)

// Recherche / filtre : retour à la page 1 puis refetch (avec debounce sur la saisie).
watchDebounced([search, country, city], () => { page.value = 1; refresh() }, { debounce: 300 })

const countryOpts = computed(() => [{ value: '', label: t('common.all') }, ...countryOptions()])
const cityOptions = computed(() => [
  { value: '', label: t('common.all') },
  ...(country.value ? citiesFor(country.value) : citiesFor('Cameroun')).map((c) => ({ value: c, label: c })),
])
const fmtDate = (d: string) => new Date(d).toLocaleDateString(locale.value === 'fr' ? 'fr-FR' : 'en-US')
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-bold text-text-strong">{{ t('admin.users.title') }}</h1>

    <!-- Filtres -->
    <div class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div class="sm:col-span-2">
        <UiInput v-model="search" :placeholder="t('admin.users.searchPlaceholder')" icon="lucide:search" />
      </div>
      <UiSelect v-model="country" :options="countryOpts" :placeholder="t('admin.filterCountry')" icon="lucide:globe" />
      <UiSelect v-model="city" :options="cityOptions" :placeholder="t('admin.filterCity')" icon="lucide:building-2" />
    </div>

    <UiCard padded class="!p-0 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="border-b border-border-base bg-surface-muted text-xs uppercase tracking-wider text-text-muted">
            <tr>
              <th class="px-5 py-3 font-medium">{{ t('admin.users.colName') }}</th>
              <th class="px-5 py-3 font-medium">{{ t('admin.users.colEmail') }}</th>
              <th class="px-5 py-3 text-center font-medium">{{ t('admin.users.colAddresses') }}</th>
              <th class="px-5 py-3 font-medium">{{ t('admin.users.colJoined') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="pending"><td colspan="4" class="px-5 py-10 text-center"><UiSpinner /></td></tr>
            <tr v-else-if="!data?.items.length"><td colspan="4" class="px-5 py-10 text-center text-text-muted">{{ t('admin.users.empty') }}</td></tr>
            <tr v-for="u in data?.items" v-else :key="u.id" class="border-b border-border-base last:border-0 hover:bg-surface-muted/50">
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-2.5">
                  <span class="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-600">
                    {{ u.fullName.charAt(0) }}
                  </span>
                  <span class="font-medium text-text-strong">{{ u.fullName }}</span>
                </div>
              </td>
              <td class="px-5 py-3.5 text-text-base">{{ u.email }}</td>
              <td class="px-5 py-3.5 text-center"><UiBadge tone="neutral">{{ u.addressCount }}</UiBadge></td>
              <td class="px-5 py-3.5 text-text-muted">{{ fmtDate(u.createdAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <AdminPagination v-if="data && data.pages > 1" :page="data.page" :pages="data.pages" @update="page = $event" />
    </UiCard>
  </div>
</template>
