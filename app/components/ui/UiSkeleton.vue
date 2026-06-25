<script setup lang="ts">
withDefaults(defineProps<{ width?: string; height?: string; rounded?: string }>(), {
  width: '100%',
  height: '1rem',
  rounded: 'var(--radius-md)',
})
</script>

<template>
  <span
    class="block bg-[linear-gradient(90deg,var(--color-ink-200)_25%,var(--color-ink-100)_50%,var(--color-ink-200)_75%)] bg-[length:800px_100%]"
    :style="{
      width,
      height,
      borderRadius: rounded,
      animation: 'shimmer 1.4s ease-in-out infinite',
    }"
    aria-hidden="true"
  />
</template>
