<template>
  <AppContainer class="py-10">
    <!-- En-tête -->
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1
          class="font-display text-2xl font-bold text-text-strong sm:text-3xl"
        >
          {{ t("dashboard.title") }}
        </h1>
        <p class="mt-1 text-text-muted">{{ t("dashboard.subtitle") }}</p>
      </div>
      <div class="flex items-center gap-3">
        <UiBadge tone="brand">{{
          t("dashboard.count", { count: store.count, max: store.max })
        }}</UiBadge>
        <!-- Bascule vue grille / liste -->
        <div
          v-if="store.count > 0"
          class="inline-flex rounded-lg border border-border-base bg-surface-card p-0.5"
          role="group"
          aria-label="Affichage"
        >
          <button
            type="button"
            class="flex h-8 w-8 items-center justify-center rounded-md transition-colors"
            :class="
              view === 'grid'
                ? 'bg-brand-500 text-white'
                : 'text-text-muted hover:text-text-strong'
            "
            :aria-pressed="view === 'grid'"
            aria-label="Vue grille"
            @click="view = 'grid'"
          >
            <Icon name="lucide:layout-grid" />
          </button>
          <button
            type="button"
            class="flex h-8 w-8 items-center justify-center rounded-md transition-colors"
            :class="
              view === 'list'
                ? 'bg-brand-500 text-white'
                : 'text-text-muted hover:text-text-strong'
            "
            :aria-pressed="view === 'list'"
            aria-label="Vue liste"
            @click="view = 'list'"
          >
            <Icon name="lucide:list" />
          </button>
        </div>
        <UiButton v-if="store.canCreate" :to="localePath('/addresses/new')">
          <Icon name="lucide:plus" /> {{ t("dashboard.newAddress") }}
        </UiButton>
      </div>
    </div>

    <UiAlert
      v-if="!store.canCreate && store.count > 0"
      tone="info"
      class="mt-6"
      >{{ t("dashboard.maxReached") }}</UiAlert
    >

    <!-- Chargement -->
    <div
      v-if="store.loading && !store.loaded"
      class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      <div
        v-for="i in 3"
        :key="i"
        class="overflow-hidden rounded-xl border border-border-base bg-surface-card"
      >
        <UiSkeleton height="160px" rounded="0" />
        <div class="space-y-2 p-5">
          <UiSkeleton width="60%" height="1.1rem" />
          <UiSkeleton width="40%" />
          <UiSkeleton width="50%" />
        </div>
      </div>
    </div>

    <!-- Erreur -->
    <UiEmptyState
      v-else-if="store.error"
      icon="lucide:cloud-off"
      :title="t('common.errorTitle')"
      :description="store.error"
    >
      <UiButton variant="ghost" @click="store.fetchAll(true)">
        <Icon name="lucide:refresh-cw" /> {{ t("common.retry") }}
      </UiButton>
    </UiEmptyState>

    <!-- Vide -->
    <UiEmptyState
      v-else-if="store.count === 0"
      icon="lucide:map-pinned"
      :title="t('dashboard.emptyTitle')"
      :description="t('dashboard.emptyDesc')"
    >
      <UiButton :to="localePath('/addresses/new')" size="lg">
        <Icon name="lucide:plus" /> {{ t("dashboard.emptyCta") }}
      </UiButton>
    </UiEmptyState>

    <!-- Vue grille -->
    <div
      v-else-if="view === 'grid'"
      class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      <AddressCard
        v-for="address in store.items"
        :key="address.id"
        :address="address"
        @delete="toDelete = $event"
        @export="onExport"
      />
    </div>

    <!-- Vue liste -->
    <ul
      v-else
      class="mt-8 divide-y divide-border-base overflow-hidden rounded-xl border border-border-base bg-surface-card"
    >
      <li
        v-for="address in store.items"
        :key="address.id"
        class="flex flex-wrap items-center gap-4 p-4 hover:bg-surface-muted/50"
      >
        <span
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-500"
        >
          <Icon name="lucide:map-pin" />
        </span>
        <div class="min-w-0 flex-1">
          <p class="font-display font-semibold text-text-strong">
            {{ address.district }}, {{ address.city }}
          </p>
          <p class="truncate text-sm text-text-muted">
            {{ address.street }} {{ address.houseNumber }} ·
            {{ address.country }}
          </p>
        </div>
        <span class="hidden font-mono text-xs text-brand-500 sm:block">{{
          address.code
        }}</span>
        <div class="flex gap-1.5">
          <NuxtLink
            :to="localePath(`/addresses/${address.id}`)"
            class="flex h-9 w-9 items-center justify-center rounded-md border border-border-base text-text-base hover:bg-surface-muted"
            :aria-label="t('address.viewDetail')"
            ><Icon name="lucide:eye"
          /></NuxtLink>
          <NuxtLink
            :to="localePath(`/addresses/edit/${address.id}`)"
            class="flex h-9 w-9 items-center justify-center rounded-md border border-border-base text-text-base hover:bg-surface-muted"
            :aria-label="t('common.edit')"
            ><Icon name="lucide:pencil"
          /></NuxtLink>
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-md border border-border-base text-text-base hover:border-error-500/30 hover:bg-error-50 hover:text-error-600"
            :aria-label="t('common.delete')"
            @click="toDelete = address"
          >
            <Icon name="lucide:trash-2" />
          </button>
        </div>
      </li>
    </ul>

    <!-- Confirmation de suppression -->
    <UiModal
      :open="!!toDelete"
      :title="t('dashboard.deleteTitle')"
      @close="toDelete = null"
    >
      <p class="mt-2 text-sm text-text-muted">
        {{ t("dashboard.deleteDesc") }}
      </p>
      <div class="mt-6 flex justify-end gap-3">
        <UiButton variant="ghost" @click="toDelete = null">{{
          t("common.cancel")
        }}</UiButton>
        <UiButton variant="danger" :loading="deleting" @click="confirmDelete">{{
          t("dashboard.deleteConfirm")
        }}</UiButton>
      </div>
    </UiModal>
  </AppContainer>
</template>

<script setup lang="ts">
// Import explicite (cf. AddressForm) : le `useStorage` de Nitro masque
// l'auto-import VueUse, ce qui le rend indéfini côté client.
import { useStorage } from "@vueuse/core";
import type { Address } from "~/types/index";

definePageMeta({ middleware: "auth" });

const { t } = useI18n();
const localePath = useLocalePath();
const store = useAddressesStore();
const toast = useToastStore();
const exportPdf = useAddressPdf();

useSeoMeta({ title: () => t("dashboard.title"), robots: "noindex" });

await useAsyncData("addresses", () => store.fetchAll());

// Vue liste / grille (persistée).
const view = useStorage<"grid" | "list">("findme-dashboard-view", "grid");

const toDelete = ref<Address | null>(null);
const deleting = ref(false);
const exportingId = ref<string | null>(null);

async function confirmDelete() {
  if (!toDelete.value) return;
  deleting.value = true;
  try {
    await store.remove(toDelete.value.id);
    toast.success(t("dashboard.deleted"));
    toDelete.value = null;
  } catch (err) {
    toast.error(parseApiError(err).message);
  } finally {
    deleting.value = false;
  }
}

async function onExport(address: Address) {
  exportingId.value = address.id;
  try {
    await exportPdf(address);
  } catch {
    toast.error(t("common.errorTitle"));
  } finally {
    exportingId.value = null;
  }
}
</script>