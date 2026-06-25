<script setup lang="ts">
withDefaults(defineProps<{ padded?: boolean; hover?: boolean }>(), {
  padded: true,
})
</script>

<template>
  <div
    class="rounded-xl border border-border-base bg-surface-card shadow-sm transition-all duration-200"
    :class="[padded && 'p-6', hover && 'hover:-translate-y-0.5 hover:shadow-md']"
  >
    <slot />
  </div>
</template>
