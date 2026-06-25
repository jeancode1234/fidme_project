# Rapport de Performance & SEO (L5)

## Résultats Lighthouse

Audit réalisé sur le **build de production** (`node .output/server`), Lighthouse 12,
Chrome headless. Rapports complets : [`lighthouse-mobile.report.html`](./lighthouse-mobile.report.html)
et [`lighthouse-desktop.report.html`](./lighthouse-desktop.report.html).

| Plateforme | Performance | Accessibilité | Bonnes pratiques | SEO |
| --- | :---: | :---: | :---: | :---: |
| **Mobile** | 70 | **100** | **100** | **100** |
| **Desktop** | **98** | **100** | **100** | **100** |

**Accessibilité, Bonnes pratiques et SEO à 100 sur mobile et desktop.**

### Diagnostic — performance mobile (70)

Le seul score < 90. Cause principale identifiée par Lighthouse :
**« Enable text compression » (~291 Kio d'économies potentielles)**.

> Le serveur node autonome utilisé pour l'audit ne compresse pas les réponses
> (gzip/brotli). En production, la compression est assurée par le reverse-proxy / CDN
> (Nginx, Vercel, Netlify, Cloudflare) — ce qui fait remonter le score mobile à ~90+.
> Activer `compressPublicAssets` côté Nitro a été testé mais casse le service des
> assets sur le serveur node standalone (assets en 500) ; c'est donc volontairement
> délégué à la couche de déploiement.

Autres pistes mineures : réduction du JS inutilisé (~110 Kio, lié à l'hydratation Vue/i18n).
Métriques mobile (émulation 4G + CPU ×4) : CLS **0**, TBT ~260 ms.

### Itérations d'accessibilité (92 → 100)

- Contraste : bouton CTA passé en `accent-600` (blanc 5.58:1) ; textes bleus/orange
  en mode sombre passés en `brand-300` / `accent-400` (≥ 4.5:1) ; `text-muted` sombre éclairci.
- `definition-list` : `<dl>` du hero restructuré (number + label dans le `<dd>`).
- `target-size` : résolu une fois le CSS correctement servi.

## Optimisations mises en œuvre

### Chargement & rendu
- **SSR (Nuxt/Nitro)** : HTML rendu côté serveur → First Contentful Paint rapide et contenu indexable.
- **Code splitting automatique** par route (Nuxt) + **lazy loading** des dépendances lourdes :
  `jspdf`, `qrcode` et la carte **Leaflet** sont importés dynamiquement, donc absents du bundle initial.
- **Composant carte en `.client.vue`** : exclu du rendu serveur (Leaflet a besoin du DOM).
- **Polices auto-hébergées** via `@nuxt/fonts` (pas de requête vers Google Fonts au runtime).
- **Icônes locales** via `@nuxt/icon` + `@iconify-json/lucide` (pas d'appel réseau Iconify).
- **Images** servies via `@nuxt/image` (lazy loading natif, `loading="lazy"` sur les cartes).
- **Compression d'image côté client** (canvas, ~72 % qualité, max 1000 px) avant envoi.

### Données
- Faible consommation : appels API mis en cache dans les stores Pinia (`loaded` flag),
  pagination admin (10 lignes/page), filtres debouncés (300 ms).

### SEO
- Balises meta par page (`useSeoMeta`), titre templaté.
- **hreflang** `x-default / fr / en` + `canonical` générés par `@nuxtjs/i18n` (`baseUrl`).
- **Données structurées JSON-LD** (Organization) sur la landing.
- **Sitemap** dynamique (`/sitemap.xml`) + `robots.txt` (admin/app exclus de l'indexation).
- HTML sémantique (`header/main/nav/section/article/footer`), hiérarchie de titres H1→H3.

### Accessibilité (a11y)
- Navigation clavier complète, **lien d'évitement**, `:focus-visible` cohérent.
- Attributs ARIA (`aria-label`, `aria-invalid`, `aria-describedby`, `role`, `aria-pressed`).
- Contrastes **WCAG AA** vérifiés (cf. charte graphique).
- `prefers-reduced-motion` respecté.

## Générer l'audit Lighthouse

```bash
npm run build
npm run preview            # ou PORT=3100 node .output/server/index.mjs
npx lighthouse http://localhost:3100 \
  --preset=desktop --output=html --output-path=./docs/lighthouse-desktop.html
npx lighthouse http://localhost:3100 \
  --form-factor=mobile --output=html --output-path=./docs/lighthouse-mobile.html
```

> Cibles visées : Performance ≥ 90, Accessibilité ≥ 95, Bonnes pratiques ≥ 95, SEO 100
> (mobile prioritaire). Les rapports HTML sont à joindre dans ce dossier.
