<script setup lang="ts">
// Garde la balise <html lang> et les hreflang alternates synchronisés
// avec la locale active (bon pour le SEO multilingue).
const head = useLocaleHead()
useHead({
  htmlAttrs: computed(() => ({ lang: head.value.htmlAttrs?.lang ?? 'fr' })),
  link: computed(() => head.value.link ?? []),
  meta: computed(() => head.value.meta ?? []),
})
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <ToastContainer />
</template>
