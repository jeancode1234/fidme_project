<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-border-base bg-surface-card">
    <AppContainer class="grid gap-8 py-12 md:grid-cols-4">
      <div class="md:col-span-2">
        <div class="flex items-center gap-2">
          <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
            <Icon name="lucide:map-pin" />
          </span>
          <span class="font-display text-lg font-extrabold text-text-strong">
            find<span class="text-brand-500 dark:text-brand-300">Me</span>
          </span>
        </div>
        <p class="mt-3 max-w-sm text-sm text-text-muted">{{ t('footer.tagline') }}</p>
        <p class="mt-4 font-mono text-xs text-text-muted">GeoLink Africa · Douala, Cameroun</p>
      </div>

      <div>
        <h2 class="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
          {{ t('footer.product') }}
        </h2>
        <ul class="space-y-2 text-sm">
          <li><NuxtLink :to="localePath('/#how')" class="text-text-base hover:text-brand-500">{{ t('nav.how') }}</NuxtLink></li>
          <li><NuxtLink :to="localePath('/register')" class="text-text-base hover:text-brand-500">{{ t('nav.signup') }}</NuxtLink></li>
          <li><NuxtLink :to="localePath('/contact')" class="text-text-base hover:text-brand-500">{{ t('nav.support') }}</NuxtLink></li>
        </ul>
      </div>

      <div>
        <h2 class="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
          {{ t('footer.legal') }}
        </h2>
        <ul class="space-y-2 text-sm">
          <li><span class="text-text-base">{{ t('footer.privacy') }}</span></li>
          <li><span class="text-text-base">{{ t('footer.terms') }}</span></li>
        </ul>
      </div>
    </AppContainer>

    <div class="border-t border-border-base py-5">
      <AppContainer>
        <p class="text-center font-mono text-xs text-text-muted">
          © {{ year }} GeoLink Africa — {{ t('footer.rights') }}
        </p>
      </AppContainer>
    </div>
  </footer>
</template>
