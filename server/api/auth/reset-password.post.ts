import { db, hashPassword } from '../../utils/db'
import { validationError } from '../../utils/auth'
import { passwordIssue } from '../../utils/validate'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ token?: string; password?: string }>(event)

  const pwIssue = passwordIssue(body.password)
  if (pwIssue) throw validationError({ password: pwIssue })

  const entry = db.resetTokens.find((t) => t.token === body.token)
  if (!entry || entry.expiresAt < Date.now()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Lien de réinitialisation invalide ou expiré.',
    })
  }

  const user = db.users.find((u) => u.id === entry.userId)
  if (!user) throw createError({ statusCode: 400, statusMessage: 'Compte introuvable.' })

  const { hash, salt } = hashPassword(body.password!)
  user.passwordHash = hash
  user.salt = salt
  db.resetTokens = db.resetTokens.filter((t) => t.token !== entry.token)

  await new Promise((r) => setTimeout(r, 300))
  return { message: 'Mot de passe réinitialisé avec succès.' }
})
