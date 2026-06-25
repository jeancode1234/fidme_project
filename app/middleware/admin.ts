// Réserve les routes /admin aux administrateurs.
export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore()
  const localePath = useLocalePath()
  if (!auth.isAuthenticated) {
    return navigateTo(localePath('/login'))
  }
  if (!auth.isAdmin) {
    return navigateTo(localePath('/dashboard'))
  }
})
