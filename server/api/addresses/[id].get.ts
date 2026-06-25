import { db } from '../../utils/db'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler((event) => {
  const user = requireAuth(event)
  const id = getRouterParam(event, 'id')
  const address = db.addresses.find((a) => a.id === id)
  if (!address) throw createError({ statusCode: 404, statusMessage: 'Adresse introuvable.' })
  if (address.userId !== user.id && user.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Accès refusé.' })
  }
  return { address }
})
