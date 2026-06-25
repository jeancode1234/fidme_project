<script setup lang="ts">
const props = defineProps<{ page: number; pages: number }>()
const emit = defineEmits<{ update: [page: number] }>()
const { t } = useI18n()
</script>

<template>
  <div class="flex items-center justify-between gap-3 border-t border-border-base px-5 py-3">
    <p class="text-sm text-text-muted">{{ t('admin.page', { page, pages }) }}</p>
    <div class="flex gap-2">
      <button
        type="button"
        class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border-base text-text-base transition-colors hover:bg-surface-muted disabled:opacity-40 disabled:pointer-events-none"
        :disabled="page <= 1"
        :aria-label="t('common.previous')"
        @click="emit('update', page - 1)"
      >
        <Icon name="lucide:chevron-left" />
      </button>
      <button
        type="button"
        class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border-base text-text-base transition-colors hover:bg-surface-muted disabled:opacity-40 disabled:pointer-events-none"
        :disabled="page >= pages"
        :aria-label="t('common.next')"
        @click="emit('update', page + 1)"
      >
        <Icon name="lucide:chevron-right" />
      </button>
    </div>
  </div>
</template>
