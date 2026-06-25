/** Géolocalisation navigateur en one-shot (sur action utilisateur). */
export function useGeolocate() {
  const locating = ref(false)
  const error = ref<'unsupported' | 'denied' | 'unavailable' | null>(null)

  function locate(): Promise<{ lat: number; lng: number } | null> {
    return new Promise((resolve) => {
      error.value = null
      if (!import.meta.client || !('geolocation' in navigator)) {
        error.value = 'unsupported'
        return resolve(null)
      }
      locating.value = true
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          locating.value = false
          resolve({
            lat: Number(pos.coords.latitude.toFixed(6)),
            lng: Number(pos.coords.longitude.toFixed(6)),
          })
        },
        (err) => {
          locating.value = false
          error.value = err.code === err.PERMISSION_DENIED ? 'denied' : 'unavailable'
          resolve(null)
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      )
    })
  }

  return { locate, locating, error }
}
