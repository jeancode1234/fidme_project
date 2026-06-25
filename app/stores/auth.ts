import { defineStore } from 'pinia'
import type { User } from '~/types'

/**
 * État d'authentification global. Les actions consomment le mock server
 * via $api. La session (token) est persistée dans un cookie SSR-safe ;
 * l'utilisateur est ré-hydraté au chargement par le plugin auth.init.
 */
export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = useCookie<string | null>('findme-token', {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
  })

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  function setSession(payload: { user: User; token: string }) {
    user.value = payload.user
    token.value = payload.token
  }

  async function register(input: { fullName: string; email: string; password: string }) {
    const { $api } = useNuxtApp()
    const res = await $api<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: input,
    })
    setSession(res)
    return res
  }

  async function login(input: { email: string; password: string }) {
    const { $api } = useNuxtApp()
    const res = await $api<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: input,
    })
    setSession(res)
    return res
  }

  /** Recharge l'utilisateur à partir du token (SSR + au boot). */
  async function fetchUser() {
    if (!token.value) return null
    const { $api } = useNuxtApp()
    try {
      const res = await $api<{ user: User }>('/auth/me')
      user.value = res.user
      return res.user
    } catch {
      // Token invalide / expiré → on nettoie.
      clear()
      return null
    }
  }

  function clear() {
    user.value = null
    token.value = null
  }

  async function logout() {
    clear()
    await navigateTo('/')
  }

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    setSession,
    register,
    login,
    fetchUser,
    logout,
    clear,
  }
})
