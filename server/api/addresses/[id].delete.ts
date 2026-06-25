import { db } from '../../utils/db'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  const id = getRouterParam(event, 'id')
  const address = db.addresses.find((a) => a.id === id)
  if (!address) throw createError({ statusCode: 404, statusMessage: 'Adresse introuvable.' })
  if (address.userId !== user.id) {
    throw createError({ statusCode: 403, statusMessage: 'Accès refusé.' })
  }
  db.addresses = db.addresses.filter((a) => a.id !== id)
  await new Promise((r) => setTimeout(r, 200))
  return { success: true }
})
