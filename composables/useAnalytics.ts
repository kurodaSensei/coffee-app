/**
 * Wrapper sobre Google Analytics 4 (gtag.js).
 *
 * El script de gtag se carga desde nuxt.config.ts. Aquí exponemos una API
 * tipada para disparar eventos custom y pageviews sin esparcir `window.gtag`
 * checks por todo el código.
 *
 * En SSR / durante el primer render cuando gtag aún no se ha cargado, las
 * llamadas se ignoran silenciosamente — nunca rompen la app.
 */

type GtagParams = Record<string, string | number | boolean | undefined | null>

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}

function gtagSafe(...args: any[]) {
  if (typeof window === 'undefined') return
  if (typeof window.gtag !== 'function') return
  window.gtag(...args)
}

export const useAnalytics = () => {
  /**
   * Envía un evento custom a GA4.
   * @example
   *   const { trackEvent } = useAnalytics()
   *   trackEvent('coffee_created', { has_sca_score: true })
   */
  function trackEvent(name: string, params?: GtagParams) {
    gtagSafe('event', name, params)
  }

  /**
   * Registra un pageview manual. Se invoca desde el plugin de analytics
   * tras cada cambio de ruta (la config en nuxt.config tiene
   * send_page_view: false para evitar duplicado en el primer load).
   */
  function trackPageView(path: string, title?: string) {
    gtagSafe('event', 'page_view', {
      page_path: path,
      page_location: typeof window !== 'undefined'
        ? window.location.origin + path
        : path,
      page_title: title,
    })
  }

  return { trackEvent, trackPageView }
}
