<script setup lang="ts">
const props = defineProps<{ value: string }>()
const { t } = useI18n()

const score = computed(() => passwordStrength(props.value))
const label = computed(() => [t('auth.pwWeak'), t('auth.pwWeak'), t('auth.pwFair'), t('auth.pwStrong')][score.value])
const tone = computed(() => ['', 'text-error-600', 'text-warning-600', 'text-success-600'][score.value])
const segColor = (i: number) =>
  i <= score.value
    ? ['', 'bg-error-500', 'bg-warning-500', 'bg-success-500'][score.value]
    : 'bg-ink-200'
</script>

<template>
  <div v-if="value" class="mt-2">
    <div class="flex gap-1">
      <span
        v-for="i in 3"
        :key="i"
        class="h-1 flex-1 rounded-full transition-colors"
        :class="segColor(i)"
      />
    </div>
    <p class="mt-1 text-xs font-medium" :class="tone">{{ label }}</p>
  </div>
</template>
