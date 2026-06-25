import { db } from '../../utils/db'
import { requireAuth, validationError } from '../../utils/auth'
import { validateAddress, addressKey, type AddressInput } from '../../utils/address'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  const id = getRouterParam(event, 'id')
  const address = db.addresses.find((a) => a.id === id)
  if (!address) throw createError({ statusCode: 404, statusMessage: 'Adresse introuvable.' })
  // Règle : on ne modifie que ses propres adresses.
  if (address.userId !== user.id) {
    throw createError({ statusCode: 403, statusMessage: 'Accès refusé.' })
  }

  const body = await readBody<AddressInput>(event)
  const fields = validateAddress(body)
  if (Object.keys(fields).length) throw validationError(fields)

  // Unicité (en excluant l'adresse courante).
  const key = addressKey(body)
  const clash = db.addresses.some(
    (a) => a.userId === user.id && a.id !== address.id && addressKey(a) === key,
  )
  if (clash) throw createError({ statusCode: 409, statusMessage: 'Cette adresse existe déjà.' })

  await new Promise((r) => setTimeout(r, 250))

  Object.assign(address, {
    country: body.country!.trim(),
    city: body.city!.trim(),
    district: body.district!.trim(),
    street: body.street!.trim(),
    houseNumber: String(body.houseNumber).trim(),
    postalCode: body.postalCode?.trim() || undefined,
    lat: body.lat!,
    lng: body.lng!,
    photoUrl: body.photoUrl ?? address.photoUrl,
    updatedAt: new Date().toISOString(),
  })
  return { address }
})
