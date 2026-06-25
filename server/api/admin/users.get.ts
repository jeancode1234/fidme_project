import { db, toUserDTO } from '../../utils/db'
import { requireAdmin } from '../../utils/auth'

export default defineEventHandler((event) => {
  requireAdmin(event)
  const q = getQuery(event)
  const search = String(q.search ?? '').trim().toLowerCase()
  const country = String(q.country ?? '').trim()
  const city = String(q.city ?? '').trim()
  const page = Math.max(1, Number(q.page) || 1)
  const perPage = 10

  let rows = db.users.filter((u) => u.role === 'user')

  if (search) {
    rows = rows.filter(
      (u) => u.email.toLowerCase().includes(search) || u.fullName.toLowerCase().includes(search),
    )
  }
  // Filtres pays / ville : utilisateurs ayant au moins une adresse correspondante.
  if (country) {
    const ids = new Set(db.addresses.filter((a) => a.country === country).map((a) => a.userId))
    rows = rows.filter((u) => ids.has(u.id))
  }
  if (city) {
    const userIds = new Set(db.addresses.filter((a) => a.city === city).map((a) => a.userId))
    rows = rows.filter((u) => userIds.has(u.id))
  }

  const total = rows.length
  const items = rows
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice((page - 1) * perPage, page * perPage)
    .map((u) => ({
      ...toUserDTO(u),
      addressCount: db.addresses.filter((a) => a.userId === u.id).length,
    }))

  return { items, total, page, perPage, pages: Math.max(1, Math.ceil(total / perPage)) }
})
