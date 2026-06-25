<script setup lang="ts">
definePageMeta({
  layout: "auth",
  middleware: "guest",
});

const { t } = useI18n();
const localePath = useLocalePath();
const auth = useAuthStore();
const toast = useToastStore();
const route = useRoute();

useSeoMeta({
  title: () => t("auth.signupTitle"),
  robots: "noindex",
});

const form = reactive({
  fullName: "",
  email: "",
  password: "",
});

const touched = reactive({
  fullName: false,
  email: false,
  password: false,
});

const serverErrors = ref<Record<string, string>>({});
const formError = ref("");
const loading = ref(false);

const errors = computed(() => ({
  fullName: touched.fullName
    ? requiredError(form.fullName, t("auth.fullName"))
    : null,

  email: touched.email ? emailError(form.email) : null,

  password: touched.password ? passwordError(form.password) : null,
}));

const fieldError = (k: "fullName" | "email" | "password") =>
  errors.value[k] || serverErrors.value[k] || "";

const canSubmit = computed(
  () =>
    !requiredError(form.fullName, "") &&
    !emailError(form.email) &&
    !passwordError(form.password)
);

async function onSubmit() {
  touched.fullName = true;
  touched.email = true;
  touched.password = true;

  serverErrors.value = {};
  formError.value = "";

  if (!canSubmit.value) {
    toast.error("Veuillez corriger les erreurs du formulaire");
    return;
  }

  loading.value = true;

  try {
    await auth.register({
      ...form,
    });

    toast.success(t("auth.registerSuccess") || "Compte créé avec succès");

    await navigateTo(
      (route.query.redirect as string) || localePath("/dashboard")
    );
  } catch (err) {
    const parsed = parseApiError(err);

    serverErrors.value = parsed.fields;

    if (!Object.keys(parsed.fields).length) {
      formError.value = parsed.message;
    }

    toast.error(parsed.message || "L'inscription a échoué");
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-bold text-text-strong">
      {{ t("auth.signupTitle") }}
    </h1>
    <p class="mt-2 text-sm text-text-muted">{{ t("auth.signupSubtitle") }}</p>

    <UiAlert v-if="formError" tone="error" class="mt-6">{{
      formError
    }}</UiAlert>

    <form class="mt-6" novalidate @submit.prevent="onSubmit">
      <UiInput
        v-model="form.fullName"
        :label="t('auth.fullName')"
        :placeholder="t('auth.fullNamePlaceholder')"
        icon="lucide:user"
        autocomplete="name"
        required
        :error="fieldError('fullName')"
        @blur="touched.fullName = true"
      />
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
      <div>
        <UiInput
          v-model="form.password"
          :label="t('auth.password')"
          :placeholder="t('auth.passwordPlaceholder')"
          type="password"
          icon="lucide:lock"
          autocomplete="new-password"
          required
          :error="fieldError('password')"
          :hint="!fieldError('password') ? t('auth.pwHint') : ''"
          @blur="touched.password = true"
        />
        <UiPasswordStrength :value="form.password" />
      </div>

      <UiButton type="submit" block size="lg" class="mt-2" :loading="loading">
        {{ t("auth.submitSignup") }}
      </UiButton>
    </form>

    <p class="mt-6 text-center text-sm text-text-muted">
      {{ t("auth.haveAccount") }}
      <NuxtLink
        :to="localePath('/login')"
        class="font-semibold text-brand-500 hover:text-brand-600"
      >
        {{ t("auth.submitSignin") }}
      </NuxtLink>
    </p>
  </div>
</template>
