// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // SSR is enabled by default — required for SEO (meta, indexable HTML).
  ssr: true,

  modules: [
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@vueuse/nuxt',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/fonts',
  ],

  css: ['~/assets/css/main.css'],

  // Nomme les composants par leur seul nom de fichier (sans préfixe de dossier) :
  // <AppHeader>, <ThemeToggle>, <AddressForm>… résolvent quel que soit le sous-dossier.
  components: [{ path: '~/components', pathPrefix: false }],

  // Tailwind v4 — CSS-first config driven by assets/css/main.css (@theme).
  vite: {
    plugins: [tailwindcss()],
  },

  // Dark mode via a `.dark` / `.light` class on <html> (paired with the
  // Tailwind `dark` custom-variant). Choice is persisted in a cookie so SSR
  // and client agree (no flash of wrong theme).
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
    storageKey: 'findme-color-mode',
  },

  // FR / EN, instant switch, persisted choice. Default locale (fr) has no
  // URL prefix; English is served under /en.
  i18n: {
    // URL absolue du site — requise pour des liens hreflang/canonical valides.
    // À surcharger en production via NUXT_PUBLIC_SITE_URL.
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://findme.geolink.africa',
    locales: [
      { code: 'fr', language: 'fr-CM', name: 'Français', file: 'fr.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
    ],
    defaultLocale: 'fr',
    strategy: 'prefix_except_default',
    lazy: true,
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'findme-lang',
      redirectOn: 'root',
      alwaysRedirect: false,
    },
  },

  // Global SEO defaults — overridden per page with useSeoMeta().
  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      titleTemplate: '%s · findMe',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#1652F0' },
        {
          name: 'description',
          content:
            'findMe — créez votre adresse numérique normalisée en quelques secondes. Géolocalisation assistée, export PDF officiel et QR code. Par GeoLink Africa.',
        },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },
})
