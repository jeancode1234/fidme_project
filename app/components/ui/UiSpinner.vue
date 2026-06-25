<script setup lang="ts">
withDefaults(defineProps<{ size?: number; label?: string }>(), {
  size: 20,
  label: 'Chargement…',
})
</script>

<template>
  <span
    class="inline-block rounded-full border-2 border-brand-500/20 border-t-brand-500"
    :style="{ width: `${size}px`, height: `${size}px`, animation: 'spin 0.7s linear infinite' }"
    role="status"
    :aria-label="label"
  />
</template>
