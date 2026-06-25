import { randomUUID } from 'node:crypto'
import { db, generateAddressCode } from '../../utils/db'
import { requireAuth, validationError } from '../../utils/auth'
import { validateAddress, addressKey, type AddressInput } from '../../utils/address'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  const body = await readBody<AddressInput>(event)

  // Règle métier : maximum 4 adresses par utilisateur.
  const owned = db.addresses.filter((a) => a.userId === user.id)
  if (owned.length >= 4) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Vous avez atteint la limite de 4 adresses.',
    })
  }

  const fields = validateAddress(body)
  if (Object.keys(fields).length) throw validationError(fields)

  // Unicité pour cet utilisateur.
  const key = addressKey(body)
  if (owned.some((a) => addressKey(a) === key)) {
    throw createError({ statusCode: 409, statusMessage: 'Cette adresse existe déjà.' })
  }

  await new Promise((r) => setTimeout(r, 300))

  const now = new Date().toISOString()
  const address = {
    id: randomUUID(),
    userId: user.id,
    code: generateAddressCode(body.city!),
    country: body.country!.trim(),
    city: body.city!.trim(),
    district: body.district!.trim(),
    street: body.street!.trim(),
    houseNumber: String(body.houseNumber).trim(),
    postalCode: body.postalCode?.trim() || undefined,
    lat: body.lat!,
    lng: body.lng!,
    photoUrl: body.photoUrl,
    status: 'active' as const,
    createdAt: now,
    updatedAt: now,
  }
  db.addresses.push(address)
  return { address }
})
