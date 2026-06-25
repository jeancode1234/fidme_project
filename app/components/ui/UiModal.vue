<script setup lang="ts">
const props = defineProps<{ open: boolean; title?: string }>()
const emit = defineEmits<{ close: [] }>()

// Ferme sur Échap + verrouille le scroll du body quand ouvert.
watch(
  () => props.open,
  (isOpen) => {
    if (import.meta.client) document.body.style.overflow = isOpen ? 'hidden' : ''
  },
)
onUnmounted(() => {
  if (import.meta.client) document.body.style.overflow = ''
})
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200"
      enter-from-class="opacity-0"
      leave-active-class="transition duration-150"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-[100] flex items-end justify-center bg-ink-900/60 p-4 backdrop-blur-sm sm:items-center"
        role="dialog"
        aria-modal="true"
        tabindex="-1"
        @click.self="emit('close')"
        @keydown="onKey"
      >
        <Transition
          enter-active-class="transition duration-200"
          enter-from-class="opacity-0 translate-y-4 sm:scale-95"
          leave-active-class="transition duration-150"
          leave-to-class="opacity-0 sm:scale-95"
        >
          <div
            v-if="open"
            class="w-full max-w-md rounded-2xl border border-border-base bg-surface-card p-6 shadow-xl"
          >
            <h2 v-if="title" class="font-display text-lg font-bold text-text-strong">{{ title }}</h2>
            <slot />
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
