<template>
  <div class="fixed top-4 right-4 z-50 space-y-3">
    <TransitionGroup name="toast">
      <div
        v-for="item in toast.items"
        :key="item.id"
        class="rounded-lg px-4 py-3 shadow-lg text-white"
        :class="{
          'bg-green-500': item.tone === 'success',
          'bg-red-500': item.tone === 'error',
          'bg-blue-500': item.tone === 'info',
          'bg-yellow-500': item.tone === 'warning',
        }"
      >
        {{ item.message }}
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useToastStore } from '#imports';
const toast = useToastStore();
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>