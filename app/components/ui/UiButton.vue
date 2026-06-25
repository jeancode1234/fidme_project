<script setup lang="ts">
/**
 * Bouton du design system findMe.
 * Polymorphe : rend <NuxtLink> si `to` est fourni, sinon <button>.
 * Variantes et tailles alignées sur la charte graphique (section 06).
 */
import { NuxtLink } from '#components'

type Variant = 'primary' | 'accent' | 'secondary' | 'ghost' | 'danger' | 'dark'
type Size = 'sm' | 'md' | 'lg' | 'xl'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    block?: boolean
    loading?: boolean
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
    to?: string
  }>(),
  { variant: 'primary', size: 'md', type: 'button' },
)

const base =
  'inline-flex items-center justify-center gap-2 font-semibold leading-none whitespace-nowrap select-none ' +
  'rounded-lg transition-all duration-200 disabled:opacity-45 disabled:pointer-events-none'

const variants: Record<Variant, string> = {
  primary:
    'bg-brand-500 text-white shadow-brand hover:bg-brand-600 hover:-translate-y-px active:translate-y-0',
  accent:
    'bg-accent-600 text-white shadow-accent hover:bg-accent-700 hover:-translate-y-px active:translate-y-0',
  secondary:
    'bg-brand-50 text-brand-600 border-[1.5px] border-brand-200 hover:bg-brand-100 hover:border-brand-300',
  ghost:
    'bg-transparent text-text-base border-[1.5px] border-ink-300 hover:bg-ink-100 dark:hover:bg-ink-700',
  danger:
    'bg-error-50 text-error-600 border-[1.5px] border-error-500/25 hover:bg-error-500 hover:text-white',
  dark: 'bg-ink-900 text-white hover:bg-ink-800',
}

const sizes: Record<Size, string> = {
  sm: 'text-[0.8125rem] px-4 py-2 rounded-md',
  md: 'text-[0.9375rem] px-6 py-3',
  lg: 'text-[1.0625rem] px-8 py-[0.9375rem] rounded-xl',
  xl: 'text-lg px-10 py-[1.125rem] rounded-xl',
}
</script>

<template>
  <component
    :is="to ? NuxtLink : 'button'"
    :to="to"
    :type="to ? undefined : type"
    :disabled="!to && (disabled || loading)"
    :aria-busy="loading || undefined"
    :class="[
      base,
      variants[variant],
      sizes[size],
      block && 'w-full',
      loading && 'relative !text-transparent',
    ]"
  >
    <slot />
    <span
      v-if="loading"
      class="absolute inset-0 m-auto h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
      style="animation: spin 0.7s linear infinite"
      aria-hidden="true"
    />
  </component>
</template>
