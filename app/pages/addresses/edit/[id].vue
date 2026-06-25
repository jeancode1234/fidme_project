<template>
  <AppContainer class="max-w-3xl py-10">
    <NuxtLink
      :to="localePath(`/addresses/${id}`)"
      class="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-brand-500"
    >
      <Icon name="lucide:arrow-left" /> {{ t("common.back") }}
    </NuxtLink>
    <h1
      class="mb-8 font-display text-2xl font-bold text-text-strong sm:text-3xl"
    >
      {{ t("address.editTitle") }}
    </h1>
    <UiCard v-if="initial">
      <AddressForm
        mode="edit"
        :initial="initial"
        :loading="loading"
        :server-error="serverError"
        :server-fields="serverFields"
        @submit="onSubmit"
      />
    </UiCard>
  </AppContainer>
</template>

<script setup lang="ts">
import type { Address } from "~/types";

definePageMeta({ middleware: "auth" });

const { t } = useI18n();
const localePath = useLocalePath();
const route = useRoute();
const store = useAddressesStore();
const toast = useToastStore();

const id = computed(() => String(route.params.id));

const { data: initial, error } = await useAsyncData(
  `address-edit-${id.value}`,
  () => store.fetchOne(id.value)
);

if (error.value)
  showError({ statusCode: 404, statusMessage: "Adresse introuvable." });

useSeoMeta({ title: () => t("address.editTitle"), robots: "noindex" });

const loading = ref(false);
const serverError = ref("");
const serverFields = ref<Record<string, string>>({});

async function onSubmit(payload: Partial<Address>) {
  loading.value = true;
  serverError.value = "";
  serverFields.value = {};
  try {
    await store.update(id.value, payload);
    toast.success(t("address.updated"));
    await navigateTo(localePath(`/addresses/${id.value}`));
  } catch (err) {
    const parsed = parseApiError(err);
    serverFields.value = parsed.fields;
    if (!Object.keys(parsed.fields).length) serverError.value = parsed.message;
  } finally {
    loading.value = false;
  }
}
</script>