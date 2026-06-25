/**
 * Ré-hydrate l'utilisateur courant à partir du cookie de session.
 * S'exécute au démarrage (serveur puis client) pour que les middlewares
 * d'accès disposent de l'état d'authentification dès le premier rendu.
 */
export default defineNuxtPlugin(async () => {
  const auth = useAuthStore()
  if (auth.token && !auth.user) {
    await auth.fetchUser()
  }
})
