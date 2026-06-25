/** Sitemap des pages publiques (FR + EN) pour l'indexation (SEO). */
export default defineEventHandler((event) => {
  const base = process.env.NUXT_PUBLIC_SITE_URL || 'https://findme.geolink.africa'
  const paths = ['', '/contact', '/login', '/register']
  const now = new Date().toISOString()

  const urls = paths
    .flatMap((p) => [`${base}${p || '/'}`, `${base}/en${p}`])
    .map(
      (loc) =>
        `  <url><loc>${loc}</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq></url>`,
    )
    .join('\n')

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
})
