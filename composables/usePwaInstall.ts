import { useLocalStorage } from '@vueuse/core'

const DISMISS_KEY = 'sorbo:pwa-install:dismissed'

// Estado compartido a nivel de módulo — los sheets se montan una sola vez en
// app.vue y cualquier instancia del composable controla el mismo ref.
const iosSheetOpen = ref(false)
const androidSheetOpen = ref(false)

/**
 * Maneja el flujo de instalación de la PWA cubriendo dos rutas:
 *  - Chrome / Edge / Android: usa el evento `beforeinstallprompt` que
 *    @vite-pwa/nuxt expone como `$pwa.showInstallPrompt` y `$pwa.install()`.
 *  - iOS Safari: no expone API de instalación, hay que mostrar las
 *    instrucciones manuales ("Compartir → Añadir a pantalla de inicio").
 *
 * `dismissed` persiste en localStorage — el banner del dashboard no vuelve a
 * aparecer una vez descartado, pero el botón "Instalar app" en /app/settings
 * sigue accesible.
 */
export const usePwaInstall = () => {
  const { $pwa } = useNuxtApp()

  const dismissed = useLocalStorage<boolean>(DISMISS_KEY, false)

  const isIOS = computed(() => {
    if (typeof window === 'undefined') return false
    const ua = window.navigator.userAgent
    if (/iPad|iPhone|iPod/.test(ua)) return true
    // iPadOS 13+ reporta como Mac; lo distinguimos por touch support.
    return ua.includes('Macintosh') && 'ontouchend' in document
  })

  const isAndroid = computed(() => {
    if (typeof window === 'undefined') return false
    return /Android/i.test(window.navigator.userAgent)
  })

  const isStandalone = computed(() => {
    if (typeof window === 'undefined') return false
    // iOS Safari guarda el flag en navigator.standalone (no display-mode).
    if ((window.navigator as any).standalone === true) return true
    return window.matchMedia('(display-mode: standalone)').matches
  })

  const hasNativePrompt = computed(() => $pwa?.showInstallPrompt === true)

  // Mostramos el banner siempre que no esté instalada ni descartada. Si
  // `beforeinstallprompt` no se disparó (Chrome es inconsistente con esto)
  // caemos a instrucciones manuales según plataforma, en lugar de ocultar
  // el banner y perder la oportunidad.
  const canShowBanner = computed(() => {
    if (isStandalone.value) return false
    if (dismissed.value) return false
    return true
  })

  /**
   * Settings es el camino secundario: solo aparece cuando el banner del
   * dashboard fue descartado. Si el banner sigue visible, no duplicamos la
   * acción en ajustes (genera ruido y confusión).
   */
  const canShowFromSettings = computed(() => !isStandalone.value && dismissed.value)

  const { trackEvent } = useAnalytics()

  async function install() {
    if (hasNativePrompt.value && $pwa) {
      const result = await $pwa.install()
      if (result?.outcome === 'accepted') {
        dismissed.value = true
        trackEvent('pwa_install_accepted', { platform: result.platform || 'web' })
      }
      return
    }
    if (isIOS.value) {
      iosSheetOpen.value = true
      return
    }
    // Android Chrome sin prompt nativo, o cualquier otro browser: mostramos
    // instrucciones manuales genéricas (menú → Instalar app).
    androidSheetOpen.value = true
  }

  function dismiss() {
    dismissed.value = true
  }

  function reset() {
    dismissed.value = false
  }

  return {
    canShowBanner,
    canShowFromSettings,
    hasNativePrompt,
    isIOS,
    isAndroid,
    isStandalone,
    dismissed,
    iosSheetOpen,
    androidSheetOpen,
    install,
    dismiss,
    reset,
  }
}
