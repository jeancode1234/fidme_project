<script setup lang="ts">
// Changement de langue instantané, sans rechargement de page.
// @nuxtjs/i18n persiste le choix via cookie (cf. nuxt.config).
const { locale, locales, setLocale } = useI18n()

const available = computed(() => locales.value)

function switchTo(code: 'fr' | 'en') {
  setLocale(code)
}
</script>

<template>
  <div
    class="inline-flex rounded-lg border border-border-base bg-surface-card p-0.5"
    role="group"
    aria-label="Choix de la langue"
  >
    <button
      v-for="l in available"
      :key="l.code"
      type="button"
      class="rounded-md px-2.5 py-1 text-xs font-semibold uppercase transition-colors"
      :class="
        locale === l.code
          ? 'bg-brand-500 text-white'
          : 'text-text-muted hover:text-text-strong'
      "
      :aria-pressed="locale === l.code"
      @click="switchTo(l.code as 'fr' | 'en')"
    >
      {{ l.code }}
    </button>
  </div>
</template>
