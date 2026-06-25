import { toUserDTO } from '../../utils/db'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler((event) => {
  const user = requireAuth(event)
  return { user: toUserDTO(user) }
})
