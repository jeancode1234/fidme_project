import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const BASE = process.env.BASE || 'http://localhost:3100'
const SHOTS = fileURLToPath(new URL('./shots/', import.meta.url))
mkdirSync(SHOTS, { recursive: true })

const issues = []
const steps = []
let page

function watch(p) {
  p.on('console', (m) => {
    if (m.type() === 'error') issues.push(`[console] ${m.text()}`)
  })
  p.on('pageerror', (e) => issues.push(`[pageerror] ${e.message}`))
  p.on('requestfailed', (r) => {
    const u = r.url()
    if (/favicon|\.map$/.test(u)) return
    issues.push(`[reqfail] ${r.failure()?.errorText} ${u}`)
  })
  p.on('response', (r) => {
    if (r.status() >= 400 && !/favicon/.test(r.url())) issues.push(`[http ${r.status()}] ${r.url()}`)
  })
}

async function step(name, fn) {
  try {
    await fn()
    steps.push(`OK   ${name}`)
  } catch (e) {
    steps.push(`FAIL ${name} :: ${e.message.split('\n')[0]}`)
    issues.push(`[step:${name}] ${e.message.split('\n')[0]}`)
    try { await page.screenshot({ path: `${SHOTS}FAIL-${name}.png` }) } catch {}
  }
}

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } })
page = await ctx.newPage()
watch(page)
page.setDefaultTimeout(30000)

await step('landing', async () => {
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.getByRole('heading', { level: 1 }).waitFor()
  await page.locator('header').first().waitFor()
  await page.locator('footer').first().waitFor()
  await page.screenshot({ path: `${SHOTS}01-landing.png`, fullPage: true })
})

await step('theme-dark', async () => {
  await page.getByRole('button', { name: /mode sombre/i }).first().click()
  await page.waitForTimeout(400)
  await page.screenshot({ path: `${SHOTS}02-dark.png` })
})

await step('lang-en', async () => {
  await page.getByRole('button', { name: '^en$', exact: false }).first().click({ trial: false }).catch(async () => {
    await page.locator('button', { hasText: /^en$/i }).first().click()
  })
  await page.waitForTimeout(500)
})

await step('login-demo', async () => {
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
  await page.getByLabel(/email/i).fill('demo@findme.africa')
  await page.getByLabel(/mot de passe|password/i).fill('Demo1234')
  await page.getByRole('button', { name: /se connecter|sign in/i }).click()
  await page.waitForURL(/\/dashboard/, { timeout: 30000 })
  await page.screenshot({ path: `${SHOTS}03-dashboard.png`, fullPage: true })
})

await step('dashboard-listview', async () => {
  const listBtn = page.getByRole('button', { name: /vue liste/i })
  if (await listBtn.count()) {
    await listBtn.first().click()
    await page.waitForTimeout(300)
    await page.screenshot({ path: `${SHOTS}04-list.png` })
  }
})

await step('create-address', async () => {
  await page.goto(`${BASE}/addresses/new`, { waitUntil: 'networkidle' })
  // étape 1 -> suivant
  await page.getByRole('button', { name: /suivant|next/i }).click()
  // étape 2 : remplir
  await page.getByLabel(/ville|city/i).fill('Douala')
  await page.getByLabel(/quartier|neighborhood/i).fill('Bonapriso')
  await page.getByLabel(/rue|street/i).fill('Rue Test')
  await page.getByLabel(/numéro|house number/i).fill('42')
  await page.getByRole('button', { name: /suivant|next/i }).click()
  // étape 3 : soumettre
  await page.getByRole('button', { name: /créer l'adresse|create address/i }).click()
  await page.waitForURL(/\/addresses\/[a-f0-9-]+$/, { timeout: 30000 })
  await page.waitForTimeout(800)
  await page.screenshot({ path: `${SHOTS}05-detail.png`, fullPage: true })
})

await step('logout', async () => {
  await ctx.clearCookies()
})

await step('admin-login', async () => {
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
  await page.getByLabel(/email/i).fill('admin@findme.africa')
  await page.getByLabel(/mot de passe|password/i).fill('Admin123')
  await page.getByRole('button', { name: /se connecter|sign in/i }).click()
  await page.waitForURL(/\/dashboard/, { timeout: 30000 })
})

for (const [name, path] of [
  ['admin-overview', '/admin'],
  ['admin-users', '/admin/users'],
  ['admin-addresses', '/admin/addresses'],
  ['admin-support', '/admin/support'],
]) {
  await step(name, async () => {
    await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' })
    await page.getByRole('heading', { level: 1 }).waitFor()
    await page.screenshot({ path: `${SHOTS}admin-${name}.png`, fullPage: true })
  })
}

await browser.close()

console.log('\n===== STEPS =====')
for (const s of steps) console.log(s)
console.log('\n===== ISSUES (' + issues.length + ') =====')
const uniq = [...new Set(issues)]
for (const i of uniq) console.log('-', i)
process.exit(0)
