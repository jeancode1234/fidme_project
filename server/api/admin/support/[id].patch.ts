import { db } from '../../../utils/db'
import { requireAdmin } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody<{ handled?: boolean }>(event)
  const msg = db.support.find((m) => m.id === id)
  if (!msg) throw createError({ statusCode: 404, statusMessage: 'Message introuvable.' })
  msg.handled = body.handled ?? !msg.handled
  return { message: msg }
})
