<template>
  <div
    class="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-6"
  >
    <!-- Glow -->
    <div
      class="absolute left-0 top-0 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-3xl"
    />

    <div
      class="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl"
    />

    <!-- Stars -->
    <div class="absolute inset-0 overflow-hidden">
      <div
        v-for="star in stars"
        :key="star.id"
        class="absolute h-1 w-1 rounded-full bg-white/50"
        :style="{
          top: star.top,
          left: star.left,
        }"
      />
    </div>

    <!-- Content -->
    <div class="relative z-10 max-w-3xl text-center">
      <!-- Badge -->
      <div
        class="mb-8 inline-flex items-center gap-2 rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-5 py-2 text-fuchsia-300"
      >
        <Icon name="lucide:alert-triangle" />

        {{ title }}
      </div>

      <!-- Error Code -->
      <div
        class="bg-gradient-to-r from-fuchsia-400 to-blue-400 bg-clip-text text-8xl font-black text-transparent md:text-[220px]"
      >
        {{ error.statusCode }}
      </div>

      <!-- Astronaut -->
      <div class="animate-bounce">
        <svg
          class="mx-auto -mt-10 mb-8 h-40 w-40"
          viewBox="0 0 200 200"
          fill="none"
        >
          <circle cx="100" cy="100" r="80" fill="#4338CA" opacity=".25" />

          <circle cx="100" cy="80" r="35" fill="white" />

          <circle cx="100" cy="80" r="18" fill="#0F172A" />

          <rect x="70" y="115" width="60" height="40" rx="12" fill="white" />
        </svg>
      </div>

      <!-- Title -->

      <h1 class="text-4xl font-bold text-white">
        {{ title }}
      </h1>

      <!-- Message -->

      <p class="mx-auto mt-4 max-w-xl text-lg text-slate-300">
        {{ message }}
      </p>

      <!-- Buttons -->

      <div class="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
        <button
          class="rounded-xl bg-gradient-to-r from-fuchsia-500 to-blue-500 px-8 py-4 font-semibold text-white shadow-xl transition hover:scale-105"
          @click="goHome"
        >
          <span class="flex items-center gap-2">
            <Icon name="lucide:arrow-left" />

            Retour à l'accueil
          </span>
        </button>

        <a
          href="mailto:support@findme.africa"
          class="rounded-xl border border-white/10 bg-white/5 px-8 py-4 font-semibold text-white backdrop-blur transition hover:bg-white/10"
        >
          <span class="flex items-center gap-2">
            <Icon name="lucide:headphones" />

            Contacter le support
          </span>
        </a>
      </div>

      <!-- Help -->

      <div
        class="mt-12 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
      >
        <div class="flex items-center gap-4">
          <div
            class="flex h-14 w-14 items-center justify-center rounded-full bg-fuchsia-500/20"
          >
            <Icon name="lucide:heart" class="text-fuchsia-400" size="28" />
          </div>

          <div class="text-left">
            <h3 class="font-semibold text-white">Besoin d'aide ?</h3>

            <p class="text-slate-400">
              Notre équipe support est disponible pour vous assister.
            </p>
          </div>
        </div>

        <a
          href="mailto:support@findme.africa"
          class="mt-5 inline-flex items-center gap-2 rounded-xl bg-fuchsia-600 px-5 py-3 text-white transition hover:bg-fuchsia-700"
        >
          <Icon name="lucide:mail" />

          Ouvrir un ticket
        </a>
      </div>

      <p class="mt-10 text-sm text-slate-500">© {{ year }} FindMe Africa</p>
    </div>
  </div>
</template>



<script setup lang="ts">
interface NuxtError {
  statusCode: number;
  statusMessage?: string;
}

const props = defineProps<{
  error: NuxtError;
}>();

/**
 * Génération des étoiles
 */
const stars = Array.from({ length: 40 }, (_, index) => ({
  id: index,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
}));

const year = new Date().getFullYear();

const title = computed(() => {
  switch (props.error.statusCode) {
    case 404:
      return "Page introuvable";

    case 403:
      return "Accès refusé";

    case 500:
      return "Erreur serveur";

    default:
      return "Une erreur est survenue";
  }
});

const message = computed(() => {
  switch (props.error.statusCode) {
    case 404:
      return "La page demandée n'existe pas ou a été déplacée.";

    case 403:
      return "Vous n'avez pas les autorisations nécessaires.";

    case 500:
      return "Une erreur interne du serveur est survenue.";

    default:
      return props.error.statusMessage ?? "Une erreur inattendue est survenue.";
  }
});

function goHome() {
  clearError({
    redirect: "/",
  });
}
</script>