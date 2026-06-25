/** Normalise une erreur $fetch en message lisible + erreurs par champ. */
export interface ParsedApiError {
  message: string
  fields: Record<string, string>
  statusCode?: number
}

export function parseApiError(err: unknown): ParsedApiError {
  const e = err as {
    statusCode?: number
    statusMessage?: string
    data?: { statusMessage?: string; message?: string; data?: { fields?: Record<string, string> } }
  }
  const body = e?.data
  const fields = body?.data?.fields ?? {}
  const message =
    body?.statusMessage ||
    body?.message ||
    e?.statusMessage ||
    'Une erreur est survenue. Vérifiez votre connexion et réessayez.'
  return { message, fields, statusCode: e?.statusCode }
}
