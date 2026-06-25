import { createHmac, timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'
import { db, type UserRecord } from './db'

/**
 * Jeton de session minimal mais réaliste : payload base64url signé HMAC.
 * Suffisant pour un mock server ; en production on utiliserait un vrai JWT.
 */
const SECRET = process.env.NUXT_AUTH_SECRET || 'findme-dev-secret-change-me'
const TTL = 60 * 60 * 24 * 7 // 7 jours

function b64url(input: string | Buffer): string {
  return Buffer.from(input).toString('base64url')
}

export function signToken(userId: string): string {
  const payload = b64url(JSON.stringify({ uid: userId, exp: Date.now() + TTL * 1000 }))
  const sig = createHmac('sha256', SECRET).update(payload).digest('base64url')
  return `${payload}.${sig}`
}

export function verifyToken(token: string): string | null {
  const [payload, sig] = token.split('.')
  if (!payload || !sig) return null
  const expected = createHmac('sha256', SECRET).update(payload).digest('base64url')
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  try {
    const { uid, exp } = JSON.parse(Buffer.from(payload, 'base64url').toString())
    if (!uid || typeof exp !== 'number' || Date.now() > exp) return null
    return uid
  } catch {
    return null
  }
}

/** Extrait l'utilisateur courant depuis le header Bearer ou le cookie. */
export function getAuthUser(event: H3Event): UserRecord | null {
  const header = getRequestHeader(event, 'authorization')
  const bearer = header?.startsWith('Bearer ') ? header.slice(7) : null
  const token = bearer || getCookie(event, 'findme-token')
  if (!token) return null
  const uid = verifyToken(token)
  if (!uid) return null
  return db.users.find((u) => u.id === uid) ?? null
}

export function requireAuth(event: H3Event): UserRecord {
  const user = getAuthUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Authentification requise.' })
  }
  return user
}

export function requireAdmin(event: H3Event): UserRecord {
  const user = requireAuth(event)
  if (user.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Accès administrateur requis.' })
  }
  return user
}

/** Erreur de validation avec détail champ par champ (consommé par le front). */
export function validationError(fields: Record<string, string>) {
  return createError({
    statusCode: 422,
    statusMessage: 'Validation échouée.',
    data: { fields },
  })
}
