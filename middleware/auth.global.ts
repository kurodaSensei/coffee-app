export default defineNuxtRouteMiddleware(async (to) => {
  // Pages can opt out of auth by declaring `definePageMeta({ auth: false })`.
  if (to.meta.auth === false) return

  const { currentUser, authLoading } = useAuth()

  if (authLoading.value) {
    await new Promise<void>((resolve) => {
      const stop = watch(
        authLoading,
        (loading) => {
          if (!loading) {
            stop()
            resolve()
          }
        },
        { immediate: true },
      )
    })
  }

  if (!currentUser.value) {
    return navigateTo({
      path: '/login',
      query: to.fullPath !== '/' ? { redirect: to.fullPath } : undefined,
    })
  }

  const settings = useSettingsStore()
  if (!settings.prefs) settings.load()
})
