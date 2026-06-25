<script setup lang="ts">
/**
 * Champ de formulaire accessible : label lié, état d'erreur/succès,
 * hint, icône optionnelle. Validation en temps réel gérée par le parent.
 */
const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    label?: string
    type?: string
    placeholder?: string
    hint?: string
    error?: string
    success?: string
    required?: boolean
    disabled?: boolean
    autocomplete?: string
    icon?: string
    datalist?: string[]
    inputmode?: string
  }>(),
  { type: 'text' },
)

defineEmits<{ 'update:modelValue': [value: string]; blur: [event: FocusEvent] }>()

const uid = useId()
const describedBy = computed(() =>
  [props.error && `${uid}-err`, props.hint && `${uid}-hint`].filter(Boolean).join(' ') || undefined,
)
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
      <input
        :id="uid"
        :value="modelValue"
        :type="type"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :autocomplete="autocomplete"
        :inputmode="inputmode"
        :list="datalist ? `${uid}-list` : undefined"
        :aria-invalid="!!error || undefined"
        :aria-describedby="describedBy"
        class="block w-full rounded-lg border-[1.5px] bg-surface-card px-4 py-3 text-[0.9375rem] text-text-strong outline-none transition-all duration-200 placeholder:text-ink-400 disabled:cursor-not-allowed disabled:bg-ink-100 focus:border-brand-500 focus:shadow-[0_0_0_3px_rgba(22,82,240,0.12)]"
        :class="[
          icon && 'pl-11',
          error
            ? 'border-error-500 focus:border-error-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]'
            : success
              ? 'border-success-500'
              : 'border-ink-300 hover:border-ink-400',
        ]"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @blur="$emit('blur', $event)"
      />
      <datalist v-if="datalist" :id="`${uid}-list`">
        <option v-for="opt in datalist" :key="opt" :value="opt" />
      </datalist>
    </div>

    <p v-if="error" :id="`${uid}-err`" class="mt-1.5 flex items-center gap-1 text-[0.8125rem] text-error-600">
      <Icon name="lucide:circle-alert" aria-hidden="true" /> {{ error }}
    </p>
    <p v-else-if="success" class="mt-1.5 flex items-center gap-1 text-[0.8125rem] text-success-600">
      <Icon name="lucide:circle-check" aria-hidden="true" /> {{ success }}
    </p>
    <p v-else-if="hint" :id="`${uid}-hint`" class="mt-1.5 text-[0.8125rem] text-text-muted">
      {{ hint }}
    </p>
  </div>
</template>
