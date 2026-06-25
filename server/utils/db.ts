import { randomUUID, scryptSync, randomBytes, timingSafeEqual } from 'node:crypto'

/**
 * Mock server — store en mémoire (L4).
 * Les données sont seedées au démarrage et persistées sur globalThis pour
 * survivre au HMR en développement. Aucun backend réel n'est requis.
 */

export interface UserRecord {
  id: string
  email: string
  fullName: string
  role: 'user' | 'admin'
  passwordHash: string
  salt: string
  createdAt: string
}

export interface AddressRecord {
  id: string
  userId: string
  code: string
  country: string
  city: string
  district: string
  street: string
  houseNumber: string
  postalCode?: string
  lat: number
  lng: number
  photoUrl?: string
  status: 'draft' | 'active' | 'pending'
  createdAt: string
  updatedAt: string
}

export interface SupportRecord {
  id: string
  name: string
  email: string
  message: string
  handled: boolean
  createdAt: string
}

export interface ResetTokenRecord {
  token: string
  userId: string
  expiresAt: number
}

interface Database {
  users: UserRecord[]
  addresses: AddressRecord[]
  support: SupportRecord[]
  resetTokens: ResetTokenRecord[]
}

// ── Mot de passe (scrypt) ────────────────────────────────────
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return { hash, salt }
}

export function verifyPassword(password: string, salt: string, hash: string): boolean {
  const computed = scryptSync(password, salt, 64)
  const stored = Buffer.from(hash, 'hex')
  return computed.length === stored.length && timingSafeEqual(computed, stored)
}

// ── Génération de code d'adresse normalisé ───────────────────
const CITY_PREFIX: Record<string, string> = {
  Douala: 'DLA',
  Yaoundé: 'YDE',
  Bafoussam: 'BAF',
  Garoua: 'GAR',
}
let codeCounter = 400

export function generateAddressCode(city: string): string {
  const prefix = CITY_PREFIX[city] ?? city.slice(0, 3).toUpperCase()
  codeCounter += Math.floor(Math.random() * 7) + 1
  return `GL-${prefix}-${String(codeCounter).padStart(5, '0')}`
}

// ── DTO (jamais exposer le hash / sel) ───────────────────────
export function toUserDTO(u: UserRecord) {
  const { passwordHash, salt, ...dto } = u
  return dto
}

// ── Seed ─────────────────────────────────────────────────────
const CITIES = ['Douala', 'Yaoundé', 'Bafoussam', 'Garoua'] as const
const CITY_COORDS: Record<string, [number, number]> = {
  Douala: [4.0511, 9.7679],
  Yaoundé: [3.848, 11.5021],
  Bafoussam: [5.4781, 10.4176],
  Garoua: [9.3017, 13.3921],
}
const DISTRICTS: Record<string, string[]> = {
  Douala: ['Akwa', 'Bonapriso', 'Deïdo', 'Bonabéri', 'Makepe'],
  Yaoundé: ['Bastos', 'Mvan', 'Nlongkak', 'Mvog-Mbi'],
  Bafoussam: ['Tamdja', 'Kamkop', 'Djeleng'],
  Garoua: ['Yelwa', 'Roumdé Adjia', 'Poumpoumré'],
}
const FIRST = ['Aïcha', 'Paul', 'Sandra', 'Jean', 'Marie', 'Ngono', 'Eric', 'Fadila', 'Yves', 'Brenda', 'Samuel', 'Linda', 'Hervé', 'Estelle']
const LAST = ['Nkeng', 'Etoa', 'Mbarga', 'Fotso', 'Abena', 'Kamga', 'Tchakounté', 'Ondoua', 'Bello', 'Ngassa']

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!
}

function jitter([lat, lng]: [number, number]): [number, number] {
  return [lat + (Math.random() - 0.5) * 0.05, lng + (Math.random() - 0.5) * 0.05]
}

function makeAddress(userId: string, city: string): AddressRecord {
  const [lat, lng] = jitter(CITY_COORDS[city]!)
  const now = new Date().toISOString()
  return {
    id: randomUUID(),
    userId,
    code: generateAddressCode(city),
    country: 'Cameroun',
    city,
    district: pick(DISTRICTS[city]!),
    street: `Rue ${Math.floor(Math.random() * 40) + 1}`,
    houseNumber: String(Math.floor(Math.random() * 200) + 1),
    lat: Number(lat.toFixed(6)),
    lng: Number(lng.toFixed(6)),
    status: 'active',
    createdAt: now,
    updatedAt: now,
  }
}

function seed(): Database {
  const users: UserRecord[] = []
  const addresses: AddressRecord[] = []
  const support: SupportRecord[] = []

  // Compte administrateur (disponible dès l'installation)
  const adminPw = hashPassword('Admin123')
  users.push({
    id: randomUUID(),
    email: 'admin@findme.africa',
    fullName: 'Admin findMe',
    role: 'admin',
    passwordHash: adminPw.hash,
    salt: adminPw.salt,
    createdAt: new Date().toISOString(),
  })

  // Compte démo (pour la soutenance)
  const demoPw = hashPassword('Demo1234')
  const demoId = randomUUID()
  users.push({
    id: demoId,
    email: 'demo@findme.africa',
    fullName: 'Aïcha Nkeng',
    role: 'user',
    passwordHash: demoPw.hash,
    salt: demoPw.salt,
    createdAt: new Date().toISOString(),
  })
  addresses.push(makeAddress(demoId, 'Douala'), makeAddress(demoId, 'Yaoundé'))

  // Utilisateurs aléatoires + adresses (pour les listes admin)
  for (let i = 0; i < 24; i++) {
    const pw = hashPassword('Password1')
    const id = randomUUID()
    const first = pick(FIRST)
    const last = pick(LAST)
    users.push({
      id,
      email: `${first}.${last}${i}`.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '') + '@example.cm',
      fullName: `${first} ${last}`,
      role: 'user',
      passwordHash: pw.hash,
      salt: pw.salt,
      createdAt: new Date(Date.now() - Math.random() * 90 * 86400000).toISOString(),
    })
    const count = Math.floor(Math.random() * 3) + 1
    for (let j = 0; j < count; j++) addresses.push(makeAddress(id, pick(CITIES)))
  }

  // Messages de support
  const subjects = [
    'Je n\'arrive pas à valider ma position GPS.',
    'Comment exporter mon adresse en PDF ?',
    'Mon adresse n\'apparaît pas pour le livreur.',
    'Puis-je avoir plus de 4 adresses ?',
    'Erreur lors de l\'upload de ma photo.',
  ]
  for (let i = 0; i < subjects.length; i++) {
    const first = pick(FIRST)
    support.push({
      id: randomUUID(),
      name: `${first} ${pick(LAST)}`,
      email: `${first.toLowerCase()}@example.cm`,
      message: subjects[i]!,
      handled: i % 3 === 0,
      createdAt: new Date(Date.now() - Math.random() * 14 * 86400000).toISOString(),
    })
  }

  return { users, addresses, support, resetTokens: [] }
}

// Singleton persistant (survit au HMR)
const g = globalThis as unknown as { __findmeDB?: Database }
export const db: Database = g.__findmeDB ?? (g.__findmeDB = seed())
