<script setup lang="ts">
// Layout des écrans d'authentification : panneau de marque + formulaire.
const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <div class="min-h-screen md:grid md:grid-cols-2">
    <!-- Panneau de marque (masqué sur mobile pour aller à l'essentiel) -->
    <aside class="relative hidden overflow-hidden bg-ink-900 p-12 md:flex md:flex-col">
      <div
        class="pointer-events-none absolute inset-0"
        style="
          background:
            radial-gradient(ellipse at 20% 60%, rgba(22, 82, 240, 0.3) 0%, transparent 55%),
            radial-gradient(ellipse at 80% 20%, rgba(0, 201, 167, 0.2) 0%, transparent 50%);
        "
      />
      <NuxtLink :to="localePath('/')" class="relative flex items-center gap-2">
        <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-white">
          <Icon name="lucide:map-pin" />
        </span>
        <span class="font-display text-xl font-extrabold text-white">
          find<span class="text-brand-400">Me</span>
        </span>
      </NuxtLink>
      <div class="relative mt-auto">
        <p class="font-display text-3xl font-bold leading-tight text-white">
          {{ t('auth.brandTitle') }}
        </p>
        <p class="mt-4 max-w-md text-ink-400">{{ t('auth.brandSubtitle') }}</p>
      </div>
    </aside>

    <!-- Formulaire -->
    <main class="flex flex-col items-center justify-center p-6 md:p-12">
      <div class="flex w-full max-w-md flex-col">
        <NuxtLink :to="localePath('/')" class="mb-8 flex items-center gap-2 md:hidden">
          <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
            <Icon name="lucide:map-pin" />
          </span>
          <span class="font-display text-lg font-extrabold text-text-strong">
            find<span class="text-brand-500 dark:text-brand-300">Me</span>
          </span>
        </NuxtLink>
        <slot />
      </div>
      <div class="mt-8 flex items-center gap-3">
        <LangSwitcher />
        <ThemeToggle />
      </div>
    </main>
    <UiToaster />
  </div>
</template>
