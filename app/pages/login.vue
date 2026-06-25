<template>
  <div>
    <h1 class="font-display text-2xl font-bold text-text-strong">
      {{ t("auth.signinTitle") }}
    </h1>
    <p class="mt-2 text-sm text-text-muted">{{ t("auth.signinSubtitle") }}</p>

    <UiAlert v-if="formError" tone="error" class="mt-6">{{
      formError
    }}</UiAlert>

    <form class="mt-6" novalidate @submit.prevent="onSubmit">
      <UiInput
        v-model="form.email"
        :label="t('auth.email')"
        :placeholder="t('auth.emailPlaceholder')"
        type="email"
        icon="lucide:mail"
        autocomplete="email"
        required
        :error="fieldError('email')"
        @blur="touched.email = true"
      />
      <UiInput
        v-model="form.password"
        :label="t('auth.password')"
        :placeholder="t('auth.passwordPlaceholder')"
        type="password"
        icon="lucide:lock"
        autocomplete="current-password"
        required
        :error="fieldError('password')"
        @blur="touched.password = true"
      />
      <div class="-mt-2 mb-4 text-right">
        <NuxtLink
          :to="localePath('/forgot-password')"
          class="text-sm font-medium text-brand-500 hover:text-brand-600"
        >
          {{ t("auth.forgotLink") }}
        </NuxtLink>
      </div>

      <UiButton type="submit" block size="lg" :loading="loading">{{
        t("auth.submitSignin")
      }}</UiButton>
    </form>

    <!-- Comptes de démonstration -->
    <div class="mt-6 rounded-lg border border-border-base bg-surface-muted p-4">
      <p class="text-xs font-semibold text-text-base">
        {{ t("auth.demoTitle") }}
      </p>
      <div class="mt-2 flex flex-col gap-2">
        <button
          type="button"
          class="text-left text-xs text-text-muted hover:text-brand-500"
          @click="fillDemo('user')"
        >
          {{ t("auth.demoUser") }}
        </button>
        <button
          type="button"
          class="text-left text-xs text-text-muted hover:text-brand-500"
          @click="fillDemo('admin')"
        >
          {{ t("auth.demoAdmin") }}
        </button>
      </div>
    </div>

    <p class="mt-6 text-center text-sm text-text-muted">
      {{ t("auth.noAccount") }}
      <NuxtLink
        :to="localePath('/register')"
        class="font-semibold text-brand-500 hover:text-brand-600"
      >
        {{ t("auth.submitSignup") }}
      </NuxtLink>
    </p>
  </div>
</template>
<script setup lang="ts">
definePageMeta({ layout: "auth", middleware: "guest" });

const { t } = useI18n();
const localePath = useLocalePath();
const auth = useAuthStore();
const toast = useToastStore();
const route = useRoute();

useSeoMeta({
  title: () => t("auth.signinTitle"),
  robots: "noindex",
});

const form = reactive({
  email: "",
  password: "",
});

const touched = reactive({
  email: false,
  password: false,
});

const serverErrors = ref<Record<string, string>>({});
const formError = ref("");
const loading = ref(false);

const errors = computed(() => ({
  email: touched.email ? emailError(form.email) : null,

  password: touched.password
    ? requiredError(form.password, t("auth.password"))
    : null,
}));

const fieldError = (k: "email" | "password") =>
  errors.value[k] || serverErrors.value[k] || "";

const canSubmit = computed(() => !emailError(form.email) && !!form.password);

async function onSubmit() {
  touched.email = true;
  touched.password = true;

  serverErrors.value = {};
  formError.value = "";

  if (!canSubmit.value) {
    toast.error("Veuillez remplir correctement le formulaire");
    return;
  }

  loading.value = true;

  try {
    await auth.login({
      ...form,
    });

    toast.success(t("auth.loginSuccess") || "Connexion réussie");

    await navigateTo(
      (route.query.redirect as string) || localePath("/dashboard")
    );
  } catch (err) {
    const parsed = parseApiError(err);

    serverErrors.value = parsed.fields;

    if (!Object.keys(parsed.fields).length) {
      formError.value = parsed.message;
    }

    toast.error(parsed.message || "Échec de la connexion");
  } finally {
    loading.value = false;
  }
}

function fillDemo(kind: "user" | "admin") {
  form.email = kind === "admin" ? "admin@findme.africa" : "demo@findme.africa";

  form.password = kind === "admin" ? "Admin123" : "Demo1234";

  toast.info(
    kind === "admin"
      ? "Compte administrateur sélectionné"
      : "Compte utilisateur sélectionné"
  );
}
</script>