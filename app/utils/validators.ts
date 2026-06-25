/**
 * Validateurs côté client — miroir des règles serveur (§2.1) pour une
 * validation en temps réel (avant soumission).
 */
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function emailError(value: string): string | null {
  if (!value.trim()) return 'L\'email est requis.'
  if (!EMAIL_RE.test(value.trim())) return 'Adresse email invalide.'
  return null
}

export function passwordError(value: string): string | null {
  if (!value) return 'Le mot de passe est requis.'
  if (value.length < 8) return 'Au moins 8 caractères.'
  if (!/[A-Z]/.test(value)) return 'Au moins une majuscule.'
  if (!/[0-9]/.test(value)) return 'Au moins un chiffre.'
  return null
}

export function requiredError(value: string, label = 'Ce champ'): string | null {
  return value?.trim() ? null : `${label} est requis.`
}

/** Score 0–3 (faible / moyen / fort) pour la jauge de robustesse. */
export function passwordStrength(value: string): 0 | 1 | 2 | 3 {
  if (!value) return 0
  let score = 0
  if (value.length >= 8) score++
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++
  if (/[0-9]/.test(value) && /[^A-Za-z0-9]/.test(value)) score++
  else if (/[0-9]/.test(value) && value.length >= 12) score++
  return Math.min(3, score) as 0 | 1 | 2 | 3
}
