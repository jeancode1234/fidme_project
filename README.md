<div align="center">

# 📍 findMe

**Portail grand public d'adressage numérique — GeoLink Africa**

Créez une adresse numérique normalisée en moins de 2 minutes :
géolocalisation assistée, document officiel PDF et QR code.

[![Nuxt](https://img.shields.io/badge/Nuxt-4-00DC82?logo=nuxt.js&logoColor=white)](https://nuxt.com)
[![Vue](https://img.shields.io/badge/Vue-3-4FC08D?logo=vue.js&logoColor=white)](https://vuejs.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)

</div>

---

## 🎯 Contexte

`findMe` est le frontend d'un service **Address-as-a-Service (AaaS)** : chaque adresse
créée devient une unité exploitable par les plateformes de livraison, les services
d'urgence et les institutions financières. Réponse au cahier des charges DHI Academy —
*Projet 4, Développeur Full Stack* (Mai 2026).

## ✨ Fonctionnalités

- 🔐 **Authentification** — inscription, connexion, mot de passe oublié / réinitialisation, validation **en temps réel**, protection des routes (middlewares), session par cookie sécurisé SSR.
- 📍 **Gestion d'adresses (CRUD)** — max 4/utilisateur, unicité, formulaire **stepper** en 3 étapes, **brouillon auto-sauvegardé**.
- 🗺️ **Carte interactive (Leaflet)** — géolocalisation navigateur + marqueur déplaçable, aperçu temps réel.
- 🖼️ **Upload photo** — aperçu immédiat + **compression côté client** (canvas) avant envoi.
- 📄 **Export PDF + QR code** — document officiel propre généré côté client (jsPDF).
- 🛠️ **Dashboard admin** — KPIs, listes paginées (utilisateurs, adresses) avec recherche/filtres, boîte de réception support (statut traité/non traité).
- 💬 **Support client** — formulaire de contact validé.
- 🌍 **Multilingue FR/EN** — changement instantané, persisté, hreflang SEO.
- 🌗 **Thème clair/sombre** — détection système + persistance, sans flash.
- ♿ **Accessibilité** — ARIA, navigation clavier, focus visible, contrastes WCAG AA.
- 🚀 **SEO & performance** — SSR, sitemap, JSON-LD, lazy loading, code splitting.

### 🔑 Comptes de démonstration

| Rôle | Email | Mot de passe |
| --- | --- | --- |
| Utilisateur | `demo@findme.africa` | `Demo1234` |
| Administrateur | `admin@findme.africa` | `Admin123` |

## 🧱 Stack & choix techniques

| Domaine | Choix | Pourquoi |
| --- | --- | --- |
| Framework | **Nuxt 4 / Vue 3** | SSR (SEO), file-based routing, code-splitting auto |
| Styling | **Tailwind CSS v4** (CSS-first `@theme`) | Tokens de la charte → utilitaires cohérents |
| État | **Pinia** | Stores modulaires typés, SSR-safe |
| Backend simulé | **Nitro server routes** (`server/`) | Mock server sans dépendance externe (L4) |
| i18n | **@nuxtjs/i18n** | FR/EN, persistance, hreflang |
| Thème | **@nuxtjs/color-mode** | Dark mode classe `.dark`, persisté |
| Carte | **Leaflet** + OpenStreetMap | Sans clé API, adapté à l'Afrique |
| PDF / QR | **jsPDF** + **qrcode** | Import dynamique (hors bundle initial) |
| Utils | **@vueuse/nuxt** | Géolocalisation, storage, debounce |

## 📂 Structure du projet

```
findme/
├── app/
│   ├── assets/css/main.css      # Design system (tokens @theme + dark mode)
│   ├── components/{ui,layout,address,admin}/
│   ├── composables/             # geolocate, image-compression, pdf
│   ├── layouts/                 # default · auth · admin
│   ├── middleware/              # auth · guest · admin
│   ├── pages/                   # routing fichier → URL
│   ├── plugins/                 # api ($fetch) · auth.init (hydratation SSR)
│   ├── stores/                  # auth · addresses · toast
│   ├── types/                   # modèle de domaine
│   └── utils/                   # validators · apiError · locations
├── server/                      # Mock server Nitro (api/, routes/, utils/)
├── i18n/locales/                # fr.json · en.json
├── docs/                        # API.md (L3) · PERFORMANCE.md (L5)
└── nuxt.config.ts
```

## 🚀 Démarrage

Prérequis : **Node ≥ 20**, npm.

```bash
npm install
npm run dev          # http://localhost:3000
```

> ⚠️ Si le port 3000 est occupé : `npm run dev -- --port 3100`

```bash
npm run build        # build de production (SSR)
npm run preview      # prévisualise le build
```

## 📡 API (mock server)

Tous les endpoints (`/api/**`) sont documentés dans **[docs/API.md](./docs/API.md)** :
auth, adresses (CRUD), support, admin — avec schémas, codes d'erreur et règles métier.
Aucun backend réel n'est requis : les données sont seedées en mémoire au démarrage.

## 🧪 Qualité & performance

Voir **[docs/PERFORMANCE.md](./docs/PERFORMANCE.md)** pour les optimisations (SSR, lazy
loading, SEO, a11y) et la procédure d'audit Lighthouse.

## 🗺️ Roadmap (4 semaines) — ✅ terminé

- [x] **S1 — Architecture & UI Foundation** : Nuxt 4, design system, layouts, routing, composants
- [x] **S2 — Authentification & Landing** : flows complets, validation temps réel, gestion d'état, landing conversion
- [x] **S3 — Core Features** : CRUD adresses, carte interactive, upload image, export PDF + QR
- [x] **S4 — Admin, Qualité & Optimisation** : dashboard admin, filtres, SEO, optimisations

---

<div align="center">
<sub>GeoLink Africa · Douala, Cameroun</sub>
</div>
