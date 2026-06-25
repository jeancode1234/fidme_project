export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isEmail(value: unknown): value is string {
  return typeof value === 'string' && EMAIL_RE.test(value.trim())
}

/** Règle métier (§2.1) : ≥ 8 caractères, au moins une majuscule et un chiffre. */
export function passwordIssue(value: unknown): string | null {
  if (typeof value !== 'string' || value.length < 8)
    return 'Le mot de passe doit contenir au moins 8 caractères.'
  if (!/[A-Z]/.test(value)) return 'Le mot de passe doit contenir au moins une majuscule.'
  if (!/[0-9]/.test(value)) return 'Le mot de passe doit contenir au moins un chiffre.'
  return null
}

export function required(value: unknown): boolean {
  return value !== undefined && value !== null && String(value).trim().length > 0
}
