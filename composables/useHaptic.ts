/**
 * Haptic feedback wrapper para acciones clave de la app.
 *
 * Usa la Vibration API (`navigator.vibrate`) que está soportada en Chrome
 * Android, Edge y Firefox. iOS Safari NO la soporta — silenciosamente se
 * vuelve noop (mejor que romper). Los iPhones tienen haptic engine real
 * pero solo accesible vía nativo, no desde PWA.
 *
 * Niveles:
 *   - light  (10ms)  → cambio de tab, hover sutil, threshold met
 *   - medium (20ms)  → guardar, crear, refresh disparado
 *   - heavy  (30ms)  → eliminar, error, acción destructiva
 *
 * Se respeta `prefers-reduced-motion` — si el usuario lo tiene activado,
 * todo es noop.
 */

type HapticLevel = 'light' | 'medium' | 'heavy'

const DURATION: Record<HapticLevel, number> = {
  light: 10,
  medium: 20,
  heavy: 30,
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
}

function canVibrate(): boolean {
  if (typeof navigator === 'undefined') return false
  return typeof navigator.vibrate === 'function'
}

export const useHaptic = () => {
  function trigger(level: HapticLevel = 'light') {
    if (prefersReducedMotion()) return
    if (!canVibrate()) return
    try {
      navigator.vibrate(DURATION[level])
    }
    catch {
      // Algunos browsers requieren user gesture context — fallamos en silencio
    }
  }

  return {
    haptic: trigger,
    light: () => trigger('light'),
    medium: () => trigger('medium'),
    heavy: () => trigger('heavy'),
  }
}
