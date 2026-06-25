<script setup lang="ts">
type Tone = 'brand' | 'success' | 'error' | 'warning' | 'info' | 'neutral' | 'dark'

const props = withDefaults(defineProps<{ tone?: Tone; dot?: boolean }>(), {
  tone: 'neutral',
})

const tones: Record<Tone, string> = {
  brand: 'bg-brand-50 text-brand-600',
  success: 'bg-success-50 text-success-600',
  error: 'bg-error-50 text-error-600',
  warning: 'bg-warning-50 text-warning-600',
  info: 'bg-info-50 text-info-600',
  neutral: 'bg-ink-100 text-ink-600',
  dark: 'bg-ink-800 text-white',
}
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold leading-none"
    :class="tones[tone]"
  >
    <span v-if="dot" class="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
    <slot />
  </span>
</template>
