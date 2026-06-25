<script setup lang="ts">
import type { Address } from '~/types'

definePageMeta({ middleware: 'auth' })
const { t } = useI18n()
const localePath = useLocalePath()
const store = useAddressesStore()
const toast = useToastStore()

useSeoMeta({ title: () => t('address.createTitle'), robots: 'noindex' })

await useAsyncData('addresses', () => store.fetchAll())
// Garde la règle métier : pas de création au-delà de 4 adresses.
if (!store.canCreate) await navigateTo(localePath('/dashboard'))

const formRef = ref<{ clearDraft: () => void } | null>(null)
const loading = ref(false)
const serverError = ref('')
const serverFields = ref<Record<string, string>>({})

async function onSubmit(payload: Partial<Address>) {
  loading.value = true
  serverError.value = ''
  serverFields.value = {}
  try {
    const created = await store.create(payload)
    formRef.value?.clearDraft()
    toast.success(t('address.created'))
    await navigateTo(localePath(`/addresses/${created.id}`))
  } catch (err) {
    const parsed = parseApiError(err)
    serverFields.value = parsed.fields
    if (!Object.keys(parsed.fields).length) serverError.value = parsed.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AppContainer class="max-w-3xl py-10">
    <NuxtLink :to="localePath('/dashboard')" class="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-brand-500">
      <Icon name="lucide:arrow-left" /> {{ t('nav.dashboard') }}
    </NuxtLink>
    <h1 class="mb-8 font-display text-2xl font-bold text-text-strong sm:text-3xl">{{ t('address.createTitle') }}</h1>
    <UiCard>
      <AddressForm
        ref="formRef"
        mode="create"
        :loading="loading"
        :server-error="serverError"
        :server-fields="serverFields"
        @submit="onSubmit"
      />
    </UiCard>
  </AppContainer>
</template>
