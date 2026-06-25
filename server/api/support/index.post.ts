import { randomUUID } from 'node:crypto'
import { db } from '../../utils/db'
import { validationError } from '../../utils/auth'
import { isEmail, required } from '../../utils/validate'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ name?: string; email?: string; message?: string }>(event)
  const fields: Record<string, string> = {}

  if (!required(body.name)) fields.name = 'Votre nom est requis.'
  if (!isEmail(body.email)) fields.email = 'Adresse email invalide.'
  if (!required(body.message) || (body.message?.trim().length ?? 0) < 10)
    fields.message = 'Le message doit contenir au moins 10 caractères.'

  if (Object.keys(fields).length) throw validationError(fields)

  await new Promise((r) => setTimeout(r, 300))

  const msg = {
    id: randomUUID(),
    name: body.name!.trim(),
    email: body.email!.trim().toLowerCase(),
    message: body.message!.trim(),
    handled: false,
    createdAt: new Date().toISOString(),
  }
  db.support.push(msg)
  return { success: true, id: msg.id }
})
