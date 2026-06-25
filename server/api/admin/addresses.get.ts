import { db } from '../../utils/db'
import { requireAdmin } from '../../utils/auth'

export default defineEventHandler((event) => {
  requireAdmin(event)
  const q = getQuery(event)
  const search = String(q.search ?? '').trim().toLowerCase()
  const country = String(q.country ?? '').trim()
  const city = String(q.city ?? '').trim()
  const district = String(q.district ?? '').trim()
  const page = Math.max(1, Number(q.page) || 1)
  const perPage = 10

  let rows = db.addresses
  if (country) rows = rows.filter((a) => a.country === country)
  if (city) rows = rows.filter((a) => a.city === city)
  if (district) rows = rows.filter((a) => a.district === district)
  if (search) {
    rows = rows.filter(
      (a) =>
        a.code.toLowerCase().includes(search) ||
        a.street.toLowerCase().includes(search) ||
        a.district.toLowerCase().includes(search),
    )
  }

  const total = rows.length
  const items = rows
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice((page - 1) * perPage, page * perPage)
    .map((a) => {
      const owner = db.users.find((u) => u.id === a.userId)
      return { ...a, ownerName: owner?.fullName ?? '—', ownerEmail: owner?.email ?? '—' }
    })

  return { items, total, page, perPage, pages: Math.max(1, Math.ceil(total / perPage)) }
})
