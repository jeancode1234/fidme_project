<script setup lang="ts">
type Tone = 'success' | 'error' | 'warning' | 'info'

const props = withDefaults(defineProps<{ tone?: Tone; title?: string }>(), {
  tone: 'info',
})

const config: Record<Tone, { wrap: string; icon: string }> = {
  success: { wrap: 'bg-success-50 border-success-500/25 text-success-600', icon: 'lucide:circle-check' },
  error: { wrap: 'bg-error-50 border-error-500/20 text-error-600', icon: 'lucide:circle-x' },
  warning: { wrap: 'bg-warning-50 border-warning-500/25 text-warning-600', icon: 'lucide:triangle-alert' },
  info: { wrap: 'bg-info-50 border-info-500/20 text-info-600', icon: 'lucide:info' },
}
</script>

<template>
  <div
    class="mb-3 flex items-start gap-3.5 rounded-lg border px-5 py-4"
    :class="config[tone].wrap"
    role="alert"
  >
    <Icon :name="config[tone].icon" class="mt-0.5 shrink-0 text-lg" aria-hidden="true" />
    <div class="flex-1">
      <p v-if="title" class="mb-0.5 text-sm font-semibold">{{ title }}</p>
      <p class="text-sm leading-relaxed opacity-90"><slot /></p>
    </div>
  </div>
</template>
