/**
 * Cuando el teclado virtual aparece y el usuario focusea un input que queda
 * tapado por el keyboard, hacemos scroll-into-view para que sea visible.
 *
 * El meta viewport ya tiene `interactive-widget=resizes-content` que achica
 * el viewport en lugar de superponer el keyboard — esto cubre el 80% de los
 * casos. Pero iOS Safari tiene quirks donde algunos inputs (especialmente
 * dentro de containers con position: fixed o flexbox stretching) no se
 * scrollean automáticamente.
 *
 * Este plugin es la red de seguridad: 300ms después del focusin (tiempo
 * para que el keyboard termine de aparecer), forzamos scrollIntoView con
 * block:center.
 */
export default defineNuxtPlugin(() => {
  if (typeof document === 'undefined') return

  document.addEventListener('focusin', (e) => {
    const target = e.target as HTMLElement
    if (!target) return
    if (!target.matches('input, textarea, [contenteditable="true"]')) return

    // Esperar a que el keyboard termine de aparecer (~300ms en iOS).
    setTimeout(() => {
      // Re-verificar que sigue siendo el activeElement por si el usuario
      // tabuló rápido a otro campo o cerró el keyboard.
      if (document.activeElement !== target) return
      try {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      catch {
        // smooth no soportado en algunos browsers viejos — fallback
        target.scrollIntoView()
      }
    }, 300)
  })
})
