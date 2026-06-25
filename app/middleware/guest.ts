// Empêche un utilisateur déjà connecté d'accéder aux écrans d'auth.
export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore()
  const localePath = useLocalePath()
  if (auth.isAuthenticated) {
    return navigateTo(localePath('/dashboard'))
  }
})
