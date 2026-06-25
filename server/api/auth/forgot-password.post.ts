import { randomBytes } from 'node:crypto'
import { db } from '../../utils/db'
import { validationError } from '../../utils/auth'
import { isEmail } from '../../utils/validate'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string }>(event)
  const email = body.email?.trim().toLowerCase() ?? ''
  if (!isEmail(email)) throw validationError({ email: 'Adresse email invalide.' })

  await new Promise((r) => setTimeout(r, 300))

  const user = db.users.find((u) => u.email === email)
  // Réponse toujours « succès » pour éviter l'énumération de comptes.
  const response = {
    message: 'Si un compte existe, un email de réinitialisation a été envoyé.',
    // En production le token partirait par email. Ici on l'expose pour la démo.
    devResetToken: undefined as string | undefined,
  }

  if (user) {
    const token = randomBytes(24).toString('hex')
    db.resetTokens.push({ token, userId: user.id, expiresAt: Date.now() + 1000 * 60 * 30 })
    response.devResetToken = token
  }

  return response
})
