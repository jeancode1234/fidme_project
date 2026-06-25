/**
 * Compression d'image côté client via canvas (§2.2 : aperçu immédiat +
 * compression avant envoi). Redimensionne à maxWidth et ré-encode en JPEG.
 * Retourne une data URL prête à envoyer au mock server.
 */
export function useImageCompression() {
  async function compress(
    file: File,
    opts: { maxWidth?: number; quality?: number } = {},
  ): Promise<{ dataUrl: string; sizeKb: number }> {
    const maxWidth = opts.maxWidth ?? 1000
    const quality = opts.quality ?? 0.72

    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, maxWidth / bitmap.width)
    const width = Math.round(bitmap.width * scale)
    const height = Math.round(bitmap.height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas non supporté')
    ctx.drawImage(bitmap, 0, 0, width, height)
    bitmap.close?.()

    const dataUrl = canvas.toDataURL('image/jpeg', quality)
    const sizeKb = Math.round((dataUrl.length * 3) / 4 / 1024)
    return { dataUrl, sizeKb }
  }

  return { compress }
}
