<script setup lang="ts">
// Bascule clair / sombre. Le choix est persisté par @nuxtjs/color-mode.
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

function toggle() {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>

<template>
  <button
    type="button"
    class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border-base text-text-base transition-colors hover:bg-surface-muted"
    :aria-label="isDark ? 'Activer le mode clair' : 'Activer le mode sombre'"
    :aria-pressed="isDark"
    @click="toggle"
  >
    <ClientOnly>
      <Icon :name="isDark ? 'lucide:sun' : 'lucide:moon'" class="text-lg" />
      <template #fallback><span class="h-5 w-5" /></template>
    </ClientOnly>
  </button>
</template>
