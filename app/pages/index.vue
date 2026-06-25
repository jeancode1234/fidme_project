<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

useSeoMeta({
  title: () => `findMe — ${t('hero.title')} ${t('hero.titleHighlight')}`,
  description: () => t('hero.subtitle'),
  ogTitle: 'findMe — Votre adresse numérique, enfin trouvable',
  ogDescription: () => t('hero.subtitle'),
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

// Données structurées (SEO) — Organisation + service.
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'findMe — GeoLink Africa',
        url: 'https://findme.geolink.africa',
        description:
          'Plateforme d\'adressage numérique normalisé (Address-as-a-Service) en Afrique.',
        areaServed: 'CM',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Douala',
          addressCountry: 'CM',
        },
      }),
    },
  ],
})

const steps = computed(() => [
  { icon: 'lucide:locate-fixed', title: t('how.step1Title'), desc: t('how.step1Desc') },
  { icon: 'lucide:clipboard-list', title: t('how.step2Title'), desc: t('how.step2Desc') },
  { icon: 'lucide:qr-code', title: t('how.step3Title'), desc: t('how.step3Desc') },
])

const testimonials = computed(() => [
  { quote: t('testimonials.q1'), name: t('testimonials.n1'), role: t('testimonials.r1') },
  { quote: t('testimonials.q2'), name: t('testimonials.n2'), role: t('testimonials.r2') },
  { quote: t('testimonials.q3'), name: t('testimonials.n3'), role: t('testimonials.r3') },
])
</script>

<template>
  <div>
    <!-- ── Hero ────────────────────────────────────────────── -->
    <section class="relative overflow-hidden bg-ink-900">
      <div
        class="pointer-events-none absolute inset-0"
        style="
          background:
            radial-gradient(ellipse at 18% 70%, rgba(22, 82, 240, 0.32) 0%, transparent 55%),
            radial-gradient(ellipse at 82% 10%, rgba(0, 201, 167, 0.2) 0%, transparent 50%);
        "
        aria-hidden="true"
      />
      <AppContainer class="relative grid items-center gap-12 py-20 md:py-28 lg:grid-cols-2">
        <div>
          <span
            class="inline-flex items-center gap-2 rounded-full border border-success-500/30 px-4 py-1.5 font-mono text-xs uppercase tracking-wider text-success-500"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-success-500" /> {{ t('hero.badge') }}
          </span>
          <h1 class="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {{ t('hero.title') }} <span class="text-brand-400">{{ t('hero.titleHighlight') }}</span>
          </h1>
          <p class="mt-6 max-w-xl text-lg leading-relaxed text-ink-300">{{ t('hero.subtitle') }}</p>
          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <UiButton :to="localePath('/register')" variant="accent" size="lg">
              <Icon name="lucide:map-pin-plus" /> {{ t('hero.ctaPrimary') }}
            </UiButton>
            <UiButton to="#how" variant="ghost" size="lg" class="!border-white/20 !text-white hover:!bg-white/10">
              {{ t('hero.ctaSecondary') }}
            </UiButton>
          </div>

          <!-- Preuves chiffrées -->
          <dl class="mt-12 grid max-w-lg grid-cols-3 gap-6">
            <div>
              <dt class="sr-only">{{ t('hero.statUsers') }}</dt>
              <dd>
                <span class="block font-display text-3xl font-extrabold text-white">25K+</span>
                <span class="mt-1 block text-sm text-ink-400">{{ t('hero.statUsers') }}</span>
              </dd>
            </div>
            <div>
              <dt class="sr-only">{{ t('hero.statAddresses') }}</dt>
              <dd>
                <span class="block font-display text-3xl font-extrabold text-white">70K+</span>
                <span class="mt-1 block text-sm text-ink-400">{{ t('hero.statAddresses') }}</span>
              </dd>
            </div>
            <div>
              <dt class="sr-only">{{ t('hero.statCities') }}</dt>
              <dd>
                <span class="block font-display text-3xl font-extrabold text-white">4</span>
                <span class="mt-1 block text-sm text-ink-400">{{ t('hero.statCities') }}</span>
              </dd>
            </div>
          </dl>
        </div>

        <!-- Carte stylisée (placeholder visuel, carte interactive en S3) -->
        <div class="relative hidden lg:block" aria-hidden="true">
          <div class="relative mx-auto aspect-square max-w-md rounded-3xl border border-white/10 bg-gradient-to-br from-brand-900 to-brand-700 p-1 shadow-xl">
            <div
              class="absolute inset-1 rounded-[1.4rem]"
              style="
                background-image:
                  linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
                background-size: 28px 28px;
              "
            />
            <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <span class="relative flex h-5 w-5">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-500 opacity-75" />
                <span class="relative inline-flex h-5 w-5 rounded-full bg-accent-500 ring-4 ring-accent-500/30" />
              </span>
            </div>
            <div class="absolute bottom-4 left-4 right-4 rounded-xl border border-white/10 bg-ink-900/80 p-4 backdrop-blur">
              <p class="font-mono text-xs text-brand-300">GL-DLA-00412</p>
              <p class="mt-1 text-sm font-semibold text-white">Akwa, Douala</p>
              <p class="font-mono text-xs text-ink-400">3.8480°N · 11.5021°E</p>
            </div>
          </div>
        </div>
      </AppContainer>
    </section>

    <!-- ── Comment ça marche ───────────────────────────────── -->
    <section id="how" class="scroll-mt-20 py-20 md:py-28">
      <AppContainer>
        <div class="mx-auto max-w-2xl text-center">
          <p class="font-mono text-xs uppercase tracking-wider text-brand-500 dark:text-brand-300">{{ t('how.tag') }}</p>
          <h2 class="mt-2 font-display text-3xl font-bold text-text-strong sm:text-4xl">{{ t('how.title') }}</h2>
          <p class="mt-4 text-text-muted">{{ t('how.subtitle') }}</p>
        </div>

        <ol class="mt-16 grid gap-8 md:grid-cols-3">
          <li v-for="(step, i) in steps" :key="i" class="relative">
            <UiCard class="h-full">
              <span class="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
                <Icon :name="step.icon" class="text-2xl" />
              </span>
              <p class="mt-5 font-mono text-xs text-accent-600 dark:text-accent-400">{{ String(i + 1).padStart(2, '0') }}</p>
              <h3 class="mt-1 font-display text-lg font-bold text-text-strong">{{ step.title }}</h3>
              <p class="mt-2 text-sm leading-relaxed text-text-muted">{{ step.desc }}</p>
            </UiCard>
          </li>
        </ol>
      </AppContainer>
    </section>

    <!-- ── Démo / aperçu ───────────────────────────────────── -->
    <section class="bg-surface-muted py-20 md:py-28">
      <AppContainer class="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p class="font-mono text-xs uppercase tracking-wider text-brand-500 dark:text-brand-300">{{ t('demo.tag') }}</p>
          <h2 class="mt-2 font-display text-3xl font-bold text-text-strong sm:text-4xl">{{ t('demo.title') }}</h2>
          <p class="mt-4 text-text-muted">{{ t('demo.subtitle') }}</p>
          <ul class="mt-6 space-y-3">
            <li v-for="feat in ['Mobile-first', 'WCAG AA', 'Export PDF + QR', 'FR / EN']" :key="feat" class="flex items-center gap-3 text-sm text-text-base">
              <Icon name="lucide:check" class="text-success-500" /> {{ feat }}
            </li>
          </ul>
        </div>
        <!-- Maquette téléphone -->
        <div class="mx-auto w-full max-w-xs" aria-hidden="true">
          <div class="rounded-[2.5rem] border-8 border-ink-900 bg-ink-900 shadow-xl">
            <div class="overflow-hidden rounded-[1.9rem] bg-surface-page">
              <div class="flex items-center gap-2 bg-brand-500 px-5 py-4 text-white">
                <Icon name="lucide:map-pin" />
                <span class="font-display text-sm font-bold">findMe</span>
              </div>
              <div class="space-y-3 p-5">
                <UiSkeleton height="120px" rounded="12px" />
                <UiSkeleton width="70%" />
                <UiSkeleton width="45%" />
                <div class="flex gap-2 pt-2">
                  <UiSkeleton height="36px" rounded="8px" />
                  <UiSkeleton height="36px" rounded="8px" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppContainer>
    </section>

    <!-- ── Témoignages ─────────────────────────────────────── -->
    <section class="py-20 md:py-28">
      <AppContainer>
        <div class="mx-auto max-w-2xl text-center">
          <p class="font-mono text-xs uppercase tracking-wider text-brand-500 dark:text-brand-300">{{ t('testimonials.tag') }}</p>
          <h2 class="mt-2 font-display text-3xl font-bold text-text-strong sm:text-4xl">{{ t('testimonials.title') }}</h2>
        </div>
        <div class="mt-14 grid gap-6 md:grid-cols-3">
          <UiCard v-for="(item, i) in testimonials" :key="i" class="flex h-full flex-col">
            <div class="flex gap-0.5 text-accent-500" aria-hidden="true">
              <Icon v-for="s in 5" :key="s" name="lucide:star" class="fill-current" />
            </div>
            <blockquote class="mt-4 flex-1 text-text-base">« {{ item.quote }} »</blockquote>
            <footer class="mt-5 flex items-center gap-3 border-t border-border-base pt-4">
              <span class="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 font-display font-bold text-brand-600">
                {{ item.name.charAt(0) }}
              </span>
              <div>
                <p class="text-sm font-semibold text-text-strong">{{ item.name }}</p>
                <p class="text-xs text-text-muted">{{ item.role }}</p>
              </div>
            </footer>
          </UiCard>
        </div>
      </AppContainer>
    </section>

    <!-- ── CTA final ───────────────────────────────────────── -->
    <section class="pb-24">
      <AppContainer>
        <div class="relative overflow-hidden rounded-3xl bg-ink-900 px-8 py-16 text-center md:px-16">
          <div
            class="pointer-events-none absolute inset-0"
            style="background: radial-gradient(ellipse at 50% 120%, rgba(22, 82, 240, 0.35) 0%, transparent 60%)"
            aria-hidden="true"
          />
          <div class="relative mx-auto max-w-xl">
            <h2 class="font-display text-3xl font-bold text-white sm:text-4xl">{{ t('finalCta.title') }}</h2>
            <p class="mt-4 text-ink-300">{{ t('finalCta.subtitle') }}</p>
            <div class="mt-8 flex justify-center">
              <UiButton :to="localePath('/register')" variant="accent" size="xl">
                <Icon name="lucide:arrow-right" /> {{ t('finalCta.button') }}
              </UiButton>
            </div>
          </div>
        </div>
      </AppContainer>
    </section>
  </div>
</template>
