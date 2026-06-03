/**
 * Swipe right desde el edge izquierdo (~24px) → router.back(), replica el
 * gesto nativo de iOS. Solo se dispara si:
 *   - El touch empezó dentro de los primeros 24px desde el borde izquierdo
 *   - El usuario se desplazó horizontalmente > 80px
 *   - No hubo deriva vertical significativa (>50px → era scroll vertical)
 *   - La velocidad de release fue suficientemente rápida (> 0.5 px/ms)
 *
 * No interfiere con:
 *   - BottomSheet drag-to-close (vertical, no horizontal)
 *   - PullToRefresh (vertical)
 *   - RatingBar (contained pointer events)
 *   - Cualquier scroll de contenido (no empieza desde edge)
 */
export default defineNuxtPlugin((nuxtApp) => {
  if (typeof window === 'undefined') return

  const router = nuxtApp.$router as any
  if (!router) return

  const EDGE_THRESHOLD = 24
  const TRIGGER_DISTANCE = 80
  const VELOCITY_THRESHOLD = 0.5
  const MAX_VERTICAL_DRIFT = 60

  let startX = 0
  let startY = 0
  let startTime = 0
  let isTracking = false

  function onTouchStart(e: TouchEvent) {
    const touch = e.touches[0]
    if (touch.clientX > EDGE_THRESHOLD) return
    startX = touch.clientX
    startY = touch.clientY
    startTime = performance.now()
    isTracking = true
  }

  function onTouchMove(e: TouchEvent) {
    if (!isTracking) return
    const touch = e.touches[0]
    const dy = Math.abs(touch.clientY - startY)
    if (dy > MAX_VERTICAL_DRIFT) {
      // El usuario está scrolleando vertical, abortar tracking
      isTracking = false
    }
  }

  function onTouchEnd(e: TouchEvent) {
    if (!isTracking) return
    isTracking = false

    const touch = e.changedTouches[0]
    const dx = touch.clientX - startX
    const dy = Math.abs(touch.clientY - startY)
    const elapsed = performance.now() - startTime
    const velocity = dx / Math.max(elapsed, 1)

    const shouldGoBack =
      dx > TRIGGER_DISTANCE
      && dy < MAX_VERTICAL_DRIFT
      && velocity > VELOCITY_THRESHOLD
      && window.history.length > 1

    if (shouldGoBack) {
      router.back()
    }
  }

  document.addEventListener('touchstart', onTouchStart, { passive: true })
  document.addEventListener('touchmove', onTouchMove, { passive: true })
  document.addEventListener('touchend', onTouchEnd, { passive: true })
})
