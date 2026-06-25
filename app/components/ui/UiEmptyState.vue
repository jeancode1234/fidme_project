<script setup lang="ts">
// État neutre réutilisable (vide / à venir / pas de résultat).
// Évite tout « écran vide » exigé par le cahier des charges.
withDefaults(
  defineProps<{ icon?: string; title?: string; description?: string }>(),
  { icon: 'lucide:sparkles' },
)
</script>

<template>
  <div class="mx-auto flex max-w-md flex-col items-center px-6 py-16 text-center">
    <span class="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
      <Icon :name="icon" class="text-3xl" />
    </span>
    <h2 v-if="title" class="mt-5 font-display text-xl font-bold text-text-strong">{{ title }}</h2>
    <p v-if="description" class="mt-2 text-sm text-text-muted">{{ description }}</p>
    <div class="mt-6"><slot /></div>
  </div>
</template>
