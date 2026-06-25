<script setup lang="ts">
const props = defineProps<{
  modelValue?: string
  label?: string
  options: { value: string; label: string }[]
  placeholder?: string
  required?: boolean
  error?: string
  hint?: string
  icon?: string
}>()
defineEmits<{ 'update:modelValue': [value: string]; blur: [event: FocusEvent] }>()

const uid = useId()
</script>

<template>
  <div class="mb-5">
    <label v-if="label" :for="uid" class="mb-1.5 block text-sm font-medium text-text-base">
      {{ label }}
      <span v-if="required" class="text-error-500" aria-hidden="true">*</span>
    </label>
    <div class="relative">
      <Icon
        v-if="icon"
        :name="icon"
        class="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
        aria-hidden="true"
      />
      <select
        :id="uid"
        :value="modelValue"
        :required="required"
        :aria-invalid="!!error || undefined"
        class="block w-full appearance-none rounded-lg border-[1.5px] bg-surface-card px-4 py-3 pr-10 text-[0.9375rem] text-text-strong outline-none transition-all duration-200 focus:border-brand-500 focus:shadow-[0_0_0_3px_rgba(22,82,240,0.12)]"
        :class="[icon && 'pl-11', error ? 'border-error-500' : 'border-ink-300 hover:border-ink-400', !modelValue && 'text-ink-400']"
        @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
        @blur="$emit('blur', $event)"
      >
        <option value="" disabled>{{ placeholder }}</option>
        <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
      </select>
      <Icon
        name="lucide:chevron-down"
        class="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400"
        aria-hidden="true"
      />
    </div>
    <p v-if="error" class="mt-1.5 flex items-center gap-1 text-[0.8125rem] text-error-600">
      <Icon name="lucide:circle-alert" aria-hidden="true" /> {{ error }}
    </p>
    <p v-else-if="hint" class="mt-1.5 text-[0.8125rem] text-text-muted">{{ hint }}</p>
  </div>
</template>
