<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const { $api } = useNuxtApp()
const toast = useToastStore()
const auth = useAuthStore()

useSeoMeta({
  title: () => t('contact.title'),
  description: () => t('contact.subtitle'),
})

const form = reactive({
  name: auth.user?.fullName ?? '',
  email: auth.user?.email ?? '',
  message: '',
})
const touched = reactive({ name: false, email: false, message: false })
const serverFields = ref<Record<string, string>>({})
const loading = ref(false)
const sent = ref(false)

function messageError(v: string): string | null {
  if (!v.trim()) return requiredError('', t('contact.message'))
  if (v.trim().length < 10) return 'Min. 10 caractères.'
  return null
}
const errors = computed(() => ({
  name: touched.name ? requiredError(form.name, t('contact.name')) : null,
  email: touched.email ? emailError(form.email) : null,
  message: touched.message ? messageError(form.message) : null,
}))
const err = (k: 'name' | 'email' | 'message') =>
  (errors.value as Record<string, string | null>)[k] || serverFields.value[k] || ''

const canSubmit = computed(
  () => !!form.name.trim() && !emailError(form.email) && form.message.trim().length >= 10,
)

async function onSubmit() {
  touched.name = touched.email = touched.message = true
  serverFields.value = {}
  if (!canSubmit.value) return
  loading.value = true
  try {
    await $api('/support', { method: 'POST', body: { ...form } })
    sent.value = true
    toast.success(t('contact.success'))
  } catch (e) {
    const parsed = parseApiError(e)
    serverFields.value = parsed.fields
    if (!Object.keys(parsed.fields).length) toast.error(parsed.message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AppContainer class="max-w-xl py-14">
    <div class="text-center">
      <span class="flex mx-auto h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
        <Icon name="lucide:life-buoy" class="text-2xl" />
      </span>
      <h1 class="mt-5 font-display text-2xl font-bold text-text-strong sm:text-3xl">{{ t('contact.title') }}</h1>
      <p class="mx-auto mt-2 max-w-md text-text-muted">{{ t('contact.subtitle') }}</p>
    </div>

    <UiCard class="mt-8">
      <div v-if="sent" class="py-6 text-center">
        <span class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success-50 text-success-600">
          <Icon name="lucide:check" class="text-2xl" />
        </span>
        <h2 class="mt-4 font-display text-xl font-bold text-text-strong">{{ t('contact.successTitle') }}</h2>
        <p class="mt-2 text-sm text-text-muted">{{ t('contact.success') }}</p>
        <UiButton :to="localePath('/')" variant="ghost" class="mt-6"><Icon name="lucide:home" /> {{ t('nav.home') }}</UiButton>
      </div>

      <form v-else novalidate @submit.prevent="onSubmit">
        <UiInput v-model="form.name" :label="t('contact.name')" icon="lucide:user" required :error="err('name')" @blur="touched.name = true" />
        <UiInput v-model="form.email" :label="t('contact.email')" type="email" icon="lucide:mail" required :error="err('email')" @blur="touched.email = true" />
        <div class="mb-5">
          <label for="msg" class="mb-1.5 block text-sm font-medium text-text-base">{{ t('contact.message') }} <span class="text-error-500">*</span></label>
          <textarea
            id="msg"
            v-model="form.message"
            rows="5"
            :placeholder="t('contact.messagePlaceholder')"
            class="block w-full resize-y rounded-lg border-[1.5px] bg-surface-card px-4 py-3 text-[0.9375rem] text-text-strong outline-none transition-all placeholder:text-ink-400 focus:border-brand-500 focus:shadow-[0_0_0_3px_rgba(22,82,240,0.12)]"
            :class="err('message') ? 'border-error-500' : 'border-ink-300 hover:border-ink-400'"
            @blur="touched.message = true"
          />
          <p v-if="err('message')" class="mt-1.5 flex items-center gap-1 text-[0.8125rem] text-error-600">
            <Icon name="lucide:circle-alert" /> {{ err('message') }}
          </p>
        </div>
        <UiButton type="submit" block size="lg" :loading="loading">{{ loading ? t('contact.sending') : t('contact.submit') }}</UiButton>
      </form>
    </UiCard>
  </AppContainer>
</template>
