export default defineNuxtRouteMiddleware(async (to) => {
  // Skip for login page
  if (to.path === '/login') return

  const { currentUser, authLoading } = useAuth()

  // Wait for auth to initialize
  if (authLoading.value) {
    await new Promise<void>((resolve) => {
      const stop = watch(authLoading, (loading) => {
        if (!loading) {
          stop()
          resolve()
        }
      }, { immediate: true })
    })
  }

  // Redirect to login if not authenticated
  if (!currentUser.value) {
    return navigateTo('/login')
  }

  // Lazy-load user preferences once authenticated
  const settings = useSettingsStore()
  if (!settings.prefs) settings.load()
})
