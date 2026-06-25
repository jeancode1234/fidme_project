<script setup lang="ts">
definePageMeta({ layout: 'auth', middleware: 'guest' })
const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const { $api } = useNuxtApp()

useSeoMeta({ title: () => t('auth.resetTitle'), robots: 'noindex' })

const token = computed(() => String(route.query.token ?? ''))
const password = ref('')
const touched = ref(false)
const loading = ref(false)
const done = ref(false)
const formError = ref('')

const pwErr = computed(() => (touched.value ? passwordError(password.value) : null))

async function onSubmit() {
  touched.value = true
  formError.value = ''
  if (passwordError(password.value)) return
  loading.value = true
  try {
    await $api('/auth/reset-password', {
      method: 'POST',
      body: { token: token.value, password: password.value },
    })
    done.value = true
  } catch (err) {
    formError.value = parseApiError(err).message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-bold text-text-strong">{{ t('auth.resetTitle') }}</h1>
    <p class="mt-2 text-sm text-text-muted">{{ t('auth.resetSubtitle') }}</p>

    <template v-if="!done">
      <UiAlert v-if="formError" tone="error" class="mt-6">{{ formError }}</UiAlert>
      <form class="mt-6" novalidate @submit.prevent="onSubmit">
        <div>
          <UiInput
            v-model="password"
            :label="t('auth.password')"
            :placeholder="t('auth.passwordPlaceholder')"
            type="password"
            icon="lucide:lock"
            autocomplete="new-password"
            required
            :error="pwErr || ''"
            :hint="!pwErr ? t('auth.pwHint') : ''"
            @blur="touched = true"
          />
          <UiPasswordStrength :value="password" />
        </div>
        <UiButton type="submit" block size="lg" class="mt-2" :loading="loading">
          {{ t('auth.submitReset') }}
        </UiButton>
      </form>
    </template>

    <template v-else>
      <UiAlert tone="success" class="mt-6">{{ t('auth.resetSuccess') }}</UiAlert>
      <UiButton :to="localePath('/login')" block size="lg" class="mt-4">{{ t('auth.submitSignin') }}</UiButton>
    </template>
  </div>
</template>
