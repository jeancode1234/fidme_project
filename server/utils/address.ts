import type { AddressRecord } from './db'
import { required } from './validate'

export interface AddressInput {
  country?: string
  city?: string
  district?: string
  street?: string
  houseNumber?: string
  postalCode?: string
  lat?: number
  lng?: number
  photoUrl?: string
  status?: AddressRecord['status']
}

/** Valide la structure d'une adresse (§2.2). Retourne les erreurs par champ. */
export function validateAddress(body: AddressInput): Record<string, string> {
  const fields: Record<string, string> = {}
  if (!required(body.country)) fields.country = 'Le pays est requis.'
  if (!required(body.city)) fields.city = 'La ville est requise.'
  if (!required(body.district)) fields.district = 'Le quartier est requis.'
  if (!required(body.street)) fields.street = 'La rue est requise.'
  if (!required(body.houseNumber)) fields.houseNumber = 'Le numéro de domicile est requis.'
  if (typeof body.lat !== 'number' || typeof body.lng !== 'number') {
    fields.position = 'La position GPS est requise.'
  }
  return fields
}

/** Clé d'unicité d'une adresse pour un utilisateur donné. */
export function addressKey(a: AddressInput): string {
  return [a.country, a.city, a.district, a.street, a.houseNumber]
    .map((s) => String(s ?? '').trim().toLowerCase())
    .join('|')
}
