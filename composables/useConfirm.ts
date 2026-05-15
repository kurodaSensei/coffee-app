export interface ConfirmOptions {
  title: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  /** Tinta el botón de confirmar como acción destructiva (terracotta). */
  destructive?: boolean
}

interface ConfirmRequest {
  options: ConfirmOptions
  resolve: (value: boolean) => void
}

// Singleton a nivel de módulo: una sola "pila" de confirmación a la vez. El
// componente UiConfirm vive en app.vue y observa este ref.
const currentRequest = ref<ConfirmRequest | null>(null)

/**
 * Reemplazo de `window.confirm()` con un BottomSheet/modal con la tipografía
 * y colores de Sorbo. Uso:
 *
 *   const ok = await confirm({ title: 'Eliminar', destructive: true, ... })
 *   if (!ok) return
 */
export const useConfirm = () => {
  function confirm(options: ConfirmOptions): Promise<boolean> {
    return new Promise((resolve) => {
      currentRequest.value = { options, resolve }
    })
  }

  function resolveCurrent(value: boolean) {
    const req = currentRequest.value
    if (!req) return
    currentRequest.value = null
    req.resolve(value)
  }

  return {
    confirm,
    currentRequest: readonly(currentRequest),
    resolveCurrent,
  }
}
