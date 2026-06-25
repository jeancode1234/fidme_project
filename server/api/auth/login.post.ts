import { db, toUserDTO, verifyPassword } from '../../utils/db'
import { signToken, validationError } from '../../utils/auth'
import { isEmail } from '../../utils/validate'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string; password?: string }>(event)
  const fields: Record<string, string> = {}

  const email = body.email?.trim().toLowerCase() ?? ''
  if (!isEmail(email)) fields.email = 'Adresse email invalide.'
  if (!body.password) fields.password = 'Mot de passe requis.'
  if (Object.keys(fields).length) throw validationError(fields)

  await new Promise((r) => setTimeout(r, 300))

  const user = db.users.find((u) => u.email === email)
  if (!user || !verifyPassword(body.password!, user.salt, user.passwordHash)) {
    // Message volontairement générique (pas d'énumération de comptes).
    throw createError({ statusCode: 401, statusMessage: 'Email ou mot de passe incorrect.' })
  }

  return { user: toUserDTO(user), token: signToken(user.id) }
})
