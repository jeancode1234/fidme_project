import { db } from '../../../utils/db'
import { requireAdmin } from '../../../utils/auth'

export default defineEventHandler((event) => {
  requireAdmin(event)
  const q = getQuery(event)
  const status = String(q.status ?? '').trim() // '', 'handled', 'pending'

  let rows = [...db.support]
  if (status === 'handled') rows = rows.filter((m) => m.handled)
  if (status === 'pending') rows = rows.filter((m) => !m.handled)

  const items = rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  return { items, total: items.length }
})
