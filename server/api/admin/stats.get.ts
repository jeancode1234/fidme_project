import { db } from '../../utils/db'
import { requireAdmin } from '../../utils/auth'

export default defineEventHandler((event) => {
  requireAdmin(event)
  return {
    users: db.users.filter((u) => u.role === 'user').length,
    addresses: db.addresses.length,
    support: db.support.length,
    supportPending: db.support.filter((m) => !m.handled).length,
    byCity: ['Douala', 'Yaoundé', 'Bafoussam', 'Garoua'].map((city) => ({
      city,
      count: db.addresses.filter((a) => a.city === city).length,
    })),
  }
})
