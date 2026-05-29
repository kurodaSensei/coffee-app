/**
 * Plugin client-only que conecta el router de Nuxt con Google Analytics.
 * Cada cambio de ruta dispara un `page_view` manual.
 *
 * Trabaja en pareja con `send_page_view: false` en el gtag('config') de
 * nuxt.config — así evitamos doble-contar el primer pageview.
 */
export default defineNuxtPlugin(() => {
  const router = useRouter()
  const { trackPageView } = useAnalytics()

  router.afterEach((to) => {
    // Espera un tick para que el documento.title se haya actualizado vía
    // useHead antes de mandarlo a GA.
    setTimeout(() => {
      trackPageView(to.fullPath, document?.title)
    }, 0)
  })
})
