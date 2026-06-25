<script setup lang="ts">
const toast = useToastStore()
const config = {
  success: { icon: 'lucide:circle-check', cls: 'border-success-500/30 text-success-600' },
  error: { icon: 'lucide:circle-x', cls: 'border-error-500/30 text-error-600' },
  info: { icon: 'lucide:info', cls: 'border-info-500/30 text-info-600' },
  warning: { icon: 'lucide:triangle-alert', cls: 'border-warning-500/30 text-warning-600' },
}
</script>

<template>
  <Teleport to="body">
    <div class="pointer-events-none fixed bottom-4 right-4 z-[200] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
      <TransitionGroup
        enter-active-class="transition duration-200"
        enter-from-class="opacity-0 translate-x-4"
        leave-active-class="transition duration-150 absolute"
        leave-to-class="opacity-0 translate-x-4"
      >
        <div
          v-for="item in toast.items"
          :key="item.id"
          class="pointer-events-auto flex items-start gap-3 rounded-xl border bg-surface-card p-4 shadow-lg"
          :class="config[item.tone].cls"
          role="status"
        >
          <Icon :name="config[item.tone].icon" class="mt-0.5 shrink-0 text-lg" aria-hidden="true" />
          <p class="flex-1 text-sm text-text-base">{{ item.message }}</p>
          <button type="button" class="text-text-muted hover:text-text-strong" aria-label="Fermer" @click="toast.remove(item.id)">
            <Icon name="lucide:x" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
