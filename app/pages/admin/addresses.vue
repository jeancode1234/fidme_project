<script setup lang="ts">
import type { Address } from '~/types'

definePageMeta({ layout: 'admin', middleware: 'admin' })
const { t, locale } = useI18n()
const { $api } = useNuxtApp()

useSeoMeta({ title: () => `${t('admin.nav.addresses')} · Admin`, robots: 'noindex' })

interface Row extends Address {
  ownerName: string
  ownerEmail: string
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
const district = ref('')
const page = ref(1)

const { data, pending, refresh } = await useAsyncData<Res>(
  'admin-addresses',
  () =>
    $api('/admin/addresses', {
      query: { search: search.value, country: country.value, city: city.value, district: district.value, page: page.value },
    }),
  { watch: [page] },
)
watchDebounced([search, country, city, district], () => { page.value = 1; refresh() }, { debounce: 300 })

const countryOpts = computed(() => [{ value: '', label: t('common.all') }, ...countryOptions()])
const cityOpts = computed(() => [
  { value: '', label: t('common.all') },
  ...(country.value ? citiesFor(country.value) : citiesFor('Cameroun')).map((c) => ({ value: c, label: c })),
])
const fmtDate = (d: string) => new Date(d).toLocaleDateString(locale.value === 'fr' ? 'fr-FR' : 'en-US')
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-bold text-text-strong">{{ t('admin.addresses.title') }}</h1>

    <div class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <UiInput v-model="search" :placeholder="t('admin.addresses.searchPlaceholder')" icon="lucide:search" />
      <UiSelect v-model="country" :options="countryOpts" :placeholder="t('admin.filterCountry')" icon="lucide:globe" />
      <UiSelect v-model="city" :options="cityOpts" :placeholder="t('admin.filterCity')" icon="lucide:building-2" />
      <UiInput v-model="district" :placeholder="t('admin.filterDistrict')" icon="lucide:map" />
    </div>

    <UiCard padded class="!p-0 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="border-b border-border-base bg-surface-muted text-xs uppercase tracking-wider text-text-muted">
            <tr>
              <th class="px-5 py-3 font-medium">{{ t('admin.addresses.colCode') }}</th>
              <th class="px-5 py-3 font-medium">{{ t('admin.addresses.colLocation') }}</th>
              <th class="px-5 py-3 font-medium">{{ t('admin.addresses.colOwner') }}</th>
              <th class="px-5 py-3 font-medium">{{ t('admin.addresses.colCreated') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="pending"><td colspan="4" class="px-5 py-10 text-center"><UiSpinner /></td></tr>
            <tr v-else-if="!data?.items.length"><td colspan="4" class="px-5 py-10 text-center text-text-muted">{{ t('admin.addresses.empty') }}</td></tr>
            <tr v-for="a in data?.items" v-else :key="a.id" class="border-b border-border-base last:border-0 hover:bg-surface-muted/50">
              <td class="px-5 py-3.5 font-mono text-xs text-brand-500">{{ a.code }}</td>
              <td class="px-5 py-3.5">
                <p class="font-medium text-text-strong">{{ a.district }}, {{ a.city }}</p>
                <p class="text-xs text-text-muted">{{ a.street }} {{ a.houseNumber }} · {{ a.country }}</p>
              </td>
              <td class="px-5 py-3.5">
                <p class="text-text-base">{{ a.ownerName }}</p>
                <p class="text-xs text-text-muted">{{ a.ownerEmail }}</p>
              </td>
              <td class="px-5 py-3.5 text-text-muted">{{ fmtDate(a.createdAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <AdminPagination v-if="data && data.pages > 1" :page="data.page" :pages="data.pages" @update="page = $event" />
    </UiCard>
  </div>
</template>
