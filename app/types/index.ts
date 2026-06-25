/**
 * Modèle de domaine findMe — dérivé du cahier des charges (§2).
 * Partagé entre stores, composables, composants et le mock server.
 */

export interface User {
  id: string
  email: string
  fullName: string
  role: 'user' | 'admin'
  createdAt: string
}

/** Une adresse numérique normalisée. Un utilisateur en a 4 au maximum. */
export interface Address {
  id: string
  userId: string
  /** Code normalisé type GL-DLA-00412 (généré côté serveur). */
  code: string
  country: string
  city: string
  district: string
  street: string
  houseNumber: string
  postalCode?: string
  lat: number
  lng: number
  /** URL de la photo du bâtiment (compressée avant envoi). */
  photoUrl?: string
  status: AddressStatus
  createdAt: string
  updatedAt: string
}

export type AddressStatus = 'draft' | 'active' | 'pending'

/** Message du formulaire de support (§2.6). */
export interface SupportMessage {
  id: string
  name: string
  email: string
  message: string
  handled: boolean
  createdAt: string
}

/** Enveloppe de réponse API standardisée (cf. L3 — API Contracts). */
export interface ApiError {
  statusCode: number
  message: string
  /** Erreurs de validation champ par champ. */
  fields?: Record<string, string>
}
