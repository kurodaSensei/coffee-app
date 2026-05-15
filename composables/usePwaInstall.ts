import { useLocalStorage } from '@vueuse/core'

const DISMISS_KEY = 'sorbo:pwa-install:dismissed'

// Estado compartido a nivel de módulo — `iosSheetOpen` necesita ser singleton
// para que abrir el sheet desde /app/settings sea visible (el bottom sheet
// se monta una sola vez en app.vue para evitar duplicarlo por instancia).
const iosSheetOpen = ref(false)

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

  const isStandalone = computed(() => {
    if (typeof window === 'undefined') return false
    // iOS Safari guarda el flag en navigator.standalone (no display-mode).
    if ((window.navigator as any).standalone === true) return true
    return window.matchMedia('(display-mode: standalone)').matches
  })

  const hasNativePrompt = computed(() => $pwa?.showInstallPrompt === true)

  const canShowBanner = computed(() => {
    if (isStandalone.value) return false
    if (dismissed.value) return false
    if (hasNativePrompt.value) return true
    if (isIOS.value) return true
    return false
  })

  /** Banner ofrecido sólo en settings (ignora dismissed). */
  const canShowFromSettings = computed(() => {
    if (isStandalone.value) return false
    if (hasNativePrompt.value) return true
    if (isIOS.value) return true
    return false
  })

  async function install() {
    if (hasNativePrompt.value && $pwa) {
      const result = await $pwa.install()
      if (result?.outcome === 'accepted') dismissed.value = true
      return
    }
    if (isIOS.value) {
      iosSheetOpen.value = true
    }
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
    isStandalone,
    dismissed,
    iosSheetOpen,
    install,
    dismiss,
    reset,
  }
}
