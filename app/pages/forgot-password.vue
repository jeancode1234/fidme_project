<script setup lang="ts">
definePageMeta({ layout: 'auth', middleware: 'guest' })
const { t } = useI18n()
const localePath = useLocalePath()
const { $api } = useNuxtApp()

useSeoMeta({ title: () => t('auth.forgotTitle'), robots: 'noindex' })

const email = ref('')
const touched = ref(false)
const loading = ref(false)
const sent = ref(false)
const devToken = ref<string | undefined>()
const formError = ref('')

const emailErr = computed(() => (touched.value ? emailError(email.value) : null))

async function onSubmit() {
  touched.value = true
  formError.value = ''
  if (emailError(email.value)) return
  loading.value = true
  try {
    const res = await $api<{ message: string; devResetToken?: string }>('/auth/forgot-password', {
      method: 'POST',
      body: { email: email.value },
    })
    devToken.value = res.devResetToken
    sent.value = true
  } catch (err) {
    formError.value = parseApiError(err).message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-bold text-text-strong">{{ t('auth.forgotTitle') }}</h1>
    <p class="mt-2 text-sm text-text-muted">{{ t('auth.forgotSubtitle') }}</p>

    <template v-if="!sent">
      <UiAlert v-if="formError" tone="error" class="mt-6">{{ formError }}</UiAlert>
      <form class="mt-6" novalidate @submit.prevent="onSubmit">
        <UiInput
          v-model="email"
          :label="t('auth.email')"
          :placeholder="t('auth.emailPlaceholder')"
          type="email"
          icon="lucide:mail"
          autocomplete="email"
          required
          :error="emailErr || ''"
          @blur="touched = true"
        />
        <UiButton type="submit" block size="lg" :loading="loading">{{ t('auth.submitForgot') }}</UiButton>
      </form>
    </template>

    <template v-else>
      <UiAlert tone="success" class="mt-6" :title="t('common.close')">{{ t('auth.forgotSent') }}</UiAlert>
      <!-- En production, ce lien partirait par email. Exposé ici pour la démo. -->
      <div v-if="devToken" class="mt-3 rounded-lg border border-border-base bg-surface-muted p-4">
        <p class="text-xs font-semibold text-text-base">{{ t('auth.devTokenLabel') }}</p>
        <NuxtLink
          :to="localePath('/reset-password') + '?token=' + devToken"
          class="mt-1 block break-all font-mono text-xs text-brand-500 hover:underline"
        >
          /reset-password?token={{ devToken }}
        </NuxtLink>
      </div>
    </template>

    <p class="mt-6 text-center text-sm">
      <NuxtLink :to="localePath('/login')" class="font-semibold text-brand-500 hover:text-brand-600">
        ← {{ t('auth.backToLogin') }}
      </NuxtLink>
    </p>
  </div>
</template>
