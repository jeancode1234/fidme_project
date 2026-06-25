<template>
  <AppContainer v-if="address" class="max-w-4xl py-10">
    <NuxtLink
      :to="localePath('/dashboard')"
      class="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-brand-500"
    >
      <Icon name="lucide:arrow-left" /> {{ t("nav.dashboard") }}
    </NuxtLink>

    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1
          class="font-display text-2xl font-bold text-text-strong sm:text-3xl"
        >
          {{ address.district }}, {{ address.city }}
        </h1>
        <p class="mt-1 text-text-muted">
          {{ address.street }} {{ address.houseNumber }} · {{ address.country }}
        </p>
      </div>
      <div class="flex gap-2">
        <UiButton
          :to="localePath(`/addresses/edit/${address.id}`)"
          variant="ghost"
          size="sm"
        >
          <Icon name="lucide:pencil" /> {{ t("common.edit") }}
        </UiButton>
        <UiButton size="sm" :loading="exporting" @click="onExport">
          <Icon name="lucide:file-down" />
          {{ exporting ? t("address.exporting") : t("address.exportPdf") }}
        </UiButton>
      </div>
    </div>

    <div class="mt-8 grid gap-6 lg:grid-cols-3">
      <!-- Carte -->
      <div class="lg:col-span-2">
        <ClientOnly>
          <AddressMap :lat="address.lat" :lng="address.lng" readonly />
          <template #fallback
            ><UiSkeleton height="288px" rounded="12px"
          /></template>
        </ClientOnly>
        <img
          v-if="address.photoUrl"
          :src="address.photoUrl"
          alt="Photo du bâtiment"
          class="mt-4 h-56 w-full rounded-xl border border-border-base object-cover"
        />
      </div>

      <!-- Carte d'info -->
      <UiCard class="h-fit">
        <p
          class="text-xs font-semibold uppercase tracking-wider text-text-muted"
        >
          {{ t("detail.code") }}
        </p>
        <button
          type="button"
          class="mt-1 flex items-center gap-2 font-mono text-lg font-bold text-brand-500 hover:text-brand-600"
          @click="copyCode"
        >
          {{ address.code }} <Icon name="lucide:copy" class="text-sm" />
        </button>

        <dl class="mt-5 space-y-3 border-t border-border-base pt-5 text-sm">
          <div class="flex justify-between gap-2">
            <dt class="text-text-muted">{{ t("address.country") }}</dt>
            <dd class="font-medium text-text-base">{{ address.country }}</dd>
          </div>
          <div class="flex justify-between gap-2">
            <dt class="text-text-muted">{{ t("address.city") }}</dt>
            <dd class="font-medium text-text-base">{{ address.city }}</dd>
          </div>
          <div class="flex justify-between gap-2">
            <dt class="text-text-muted">{{ t("address.district") }}</dt>
            <dd class="font-medium text-text-base">{{ address.district }}</dd>
          </div>
          <div v-if="address.postalCode" class="flex justify-between gap-2">
            <dt class="text-text-muted">{{ t("address.postalCode") }}</dt>
            <dd class="font-medium text-text-base">{{ address.postalCode }}</dd>
          </div>
        </dl>

        <div class="mt-5 border-t border-border-base pt-5">
          <p
            class="text-xs font-semibold uppercase tracking-wider text-text-muted"
          >
            {{ t("detail.coordinates") }}
          </p>
          <p class="mt-1 font-mono text-sm text-text-base">
            {{ address.lat.toFixed(6) }}, {{ address.lng.toFixed(6) }}
          </p>
        </div>

        <div
          v-if="qrDataUrl"
          class="mt-5 flex flex-col items-center border-t border-border-base pt-5"
        >
          <img
            :src="qrDataUrl"
            alt="QR code de localisation"
            class="h-32 w-32 rounded-lg"
          />
          <p class="mt-2 text-xs text-text-muted">{{ t("detail.share") }}</p>
        </div>
      </UiCard>
    </div>
  </AppContainer>
</template>
<script setup lang="ts">
definePageMeta({ middleware: "auth" });
const { t } = useI18n();
const localePath = useLocalePath();
const route = useRoute();
const store = useAddressesStore();
const toast = useToastStore();
const { exportPdf } = useAddressPdf();

const id = computed(() => String(route.params.id));

const { data: address, error } = await useAsyncData(`address-${id.value}`, () =>
  store.fetchOne(id.value)
);
if (error.value)
  showError({ statusCode: 404, statusMessage: "Adresse introuvable." });

useSeoMeta({
  title: () =>
    address.value
      ? `${address.value.district}, ${address.value.city}`
      : t("detail.title"),
  robots: "noindex",
});

// QR code (généré côté client).
const qrDataUrl = ref("");
onMounted(async () => {
  if (!address.value) return;
  const QRCode = await import("qrcode");
  qrDataUrl.value = await QRCode.toDataURL(
    `https://www.google.com/maps?q=${address.value.lat},${address.value.lng}`,
    { margin: 1, width: 180 }
  );
});

const exporting = ref(false);
async function onExport() {
  if (!address.value) return;
  exporting.value = true;
  try {
    await exportPdf(address.value);
  } catch {
    toast.error(t("common.errorTitle"));
  } finally {
    exporting.value = false;
  }
}

function copyCode() {
  if (!address.value) return;
  navigator.clipboard?.writeText(address.value.code);
  toast.success(t("detail.copied"));
}
</script>