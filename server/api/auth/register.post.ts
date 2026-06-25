import { randomUUID } from 'node:crypto'
import { db, hashPassword, toUserDTO } from '../../utils/db'
import { signToken, validationError } from '../../utils/auth'
import { isEmail, passwordIssue } from '../../utils/validate'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ fullName?: string; email?: string; password?: string }>(event)
  const fields: Record<string, string> = {}

  const fullName = body.fullName?.trim() ?? ''
  const email = body.email?.trim().toLowerCase() ?? ''

  if (fullName.length < 2) fields.fullName = 'Veuillez indiquer votre nom complet.'
  if (!isEmail(email)) fields.email = 'Adresse email invalide.'
  const pwIssue = passwordIssue(body.password)
  if (pwIssue) fields.password = pwIssue

  if (Object.keys(fields).length) throw validationError(fields)

  // Email unique
  if (db.users.some((u) => u.email === email)) {
    throw validationError({ email: 'Cet email est déjà utilisé.' })
  }

  const { hash, salt } = hashPassword(body.password!)
  const user = {
    id: randomUUID(),
    email,
    fullName,
    role: 'user' as const,
    passwordHash: hash,
    salt,
    createdAt: new Date().toISOString(),
  }
  db.users.push(user)

  // Latence simulée pour démontrer les états de chargement.
  await new Promise((r) => setTimeout(r, 300))

  return { user: toUserDTO(user), token: signToken(user.id) }
})
