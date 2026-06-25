/**
 * Instance $fetch préconfigurée ($api) :
 *  - baseURL /api
 *  - injecte le jeton (Bearer) depuis le cookie de session
 *  - forwarde le cookie pendant le SSR (defense in depth)
 */
export default defineNuxtPlugin(() => {
  const token = useCookie<string | null>('findme-token')
  const reqHeaders = import.meta.server ? useRequestHeaders(['cookie']) : {}

  const api = $fetch.create({
    baseURL: '/api',
    onRequest({ options }) {
      const headers = new Headers(options.headers as HeadersInit)
      if (token.value) headers.set('Authorization', `Bearer ${token.value}`)
      if (import.meta.server && reqHeaders.cookie) headers.set('cookie', reqHeaders.cookie)
      options.headers = headers
    },
  })

  return { provide: { api } }
})
