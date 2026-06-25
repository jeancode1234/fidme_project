<template>
  <article
    class="overflow-hidden rounded-xl border border-border-base bg-surface-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
  >
    <!-- Visuel : photo ou fond carte stylisé -->
    <div class="relative h-40 overflow-hidden">
      <img
        v-if="address.photoUrl"
        :src="address.photoUrl"
        :alt="`${address.district}, ${address.city}`"
        class="h-full w-full object-cover"
        loading="lazy"
      />
      <div
        v-else
        class="h-full w-full bg-gradient-to-br from-brand-900 to-brand-700"
      >
        <div
          class="absolute inset-0"
          style="
            background-image: linear-gradient(
                rgba(255, 255, 255, 0.05) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(255, 255, 255, 0.05) 1px,
                transparent 1px
              );
            background-size: 20px 20px;
          "
        />
        <Icon
          name="lucide:map-pin"
          class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl text-accent-500"
        />
      </div>
      <div class="absolute right-3 top-3">
        <UiBadge :tone="statusTone[address.status]" dot>{{
          statusLabel
        }}</UiBadge>
      </div>
    </div>

    <div class="p-5">
      <div class="flex items-start justify-between gap-2">
        <div>
          <h3 class="font-display text-base font-bold text-text-strong">
            {{ address.district }}, {{ address.city }}
          </h3>
          <p class="mt-0.5 text-sm text-text-muted">
            {{ address.street }} {{ address.houseNumber }} ·
            {{ address.country }}
          </p>
        </div>
      </div>
      <p
        class="mt-3 border-t border-border-base pt-3 font-mono text-xs text-brand-500"
      >
        {{ address.code }}
      </p>
      <p class="font-mono text-xs text-text-muted">
        {{ address.lat.toFixed(4) }}°N · {{ address.lng.toFixed(4) }}°E
      </p>
    </div>

    <div
      class="flex gap-2 border-t border-border-base bg-surface-muted px-4 py-3"
    >
      <NuxtLink
        :to="localePath(`/addresses/${address.id}`)"
        class="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border-base bg-surface-card px-2 py-2 text-xs font-medium text-text-base transition-colors hover:border-ink-300"
      >
        <Icon name="lucide:eye" /> {{ t("address.viewDetail") }}
      </NuxtLink>
      <NuxtLink
        :to="localePath(`/addresses/edit/${address.id}`)"
        class="flex items-center justify-center gap-1.5 rounded-md border border-border-base bg-surface-card px-3 py-2 text-xs font-medium text-text-base transition-colors hover:border-ink-300"
        :aria-label="t('common.edit')"
      >
        <Icon name="lucide:pencil" />
      </NuxtLink>
      <button
        type="button"
        class="flex items-center justify-center gap-1.5 rounded-md border border-border-base bg-surface-card px-3 py-2 text-xs font-medium text-text-base transition-colors hover:border-error-500/30 hover:bg-error-50 hover:text-error-600"
        :aria-label="t('common.delete')"
        @click="emit('delete', address)"
      >
        <Icon name="lucide:trash-2" />
      </button>
    </div>
  </article>
</template>
<script setup lang="ts">
import type { Address } from "~/types";

const props = defineProps<{ address: Address }>();
const emit = defineEmits<{
  delete: [address: Address];
  export: [address: Address];
}>();

const { t } = useI18n();
const localePath = useLocalePath();

const statusTone = {
  active: "success",
  draft: "neutral",
  pending: "warning",
} as const;
const statusLabel = computed(
  () =>
    ({
      active: t("address.statusActive"),
      draft: t("address.statusDraft"),
      pending: t("address.statusPending"),
    }[props.address.status])
);
</script>